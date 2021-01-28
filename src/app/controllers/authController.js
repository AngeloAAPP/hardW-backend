const bcrypt = require('bcrypt')
const User = require('../../database/models/User')
const {generateToken, generateRefreshToken} = require('../helpers/tokens')
const {encode, decode} = require('../helpers/hashids')
const {client: Cache, setCache, getCache, destroyCache} = require('../helpers/redis')
const {sendResetPasswordMail} = require('../services/mail')

module.exports = {
    //login
    authenticate: async(req,res) => {
        try{
            const {email, password} = req.body

            if(!email || !password)
                return res.status(400).json({
                    success: false,
                    message: "Email e senha são obrigatórios"
                })

            const user = await User.findOne({
                where: {email},
                attributes: ['id','name', 'lastName', 'email', 'password', 'whatsapp', 'avatarUrl', 'createdAt'],
                include: [
                    {
                        association: 'address',
                        attributes: ['zipCode', 'street', 'neighbourhood', 'city', 'uf']
                    },
                    {
                        association: 'adverts',
                        separate: true,
                        order: [['createdAt', 'DESC']],
                        include: {
                            association: 'images',
                            attributes: ['id','url']
                        }
                    }
                    
                ]
            })

            if(!user)
                return res.status(400).json({
                    success: false,
                    message: "Nenhum usuário foi encontrado com o email informado"
                })

            //compare password
            if(! await bcrypt.compare(password, user.password))
                return res.status(400).json({
                    success: false,
                    message: "Senha incorreta"
                })

            const refreshToken = generateRefreshToken()

            //encode user id
            const encodedID = encode(user.id)

            res.setHeader('Authorization', 'Bearer ' + generateToken({user: encodedID}, 300))
            res.setHeader('Refresh', refreshToken)

            await setCache(Cache, refreshToken, encodedID, 2592000)

            //omit password in return data
            user.password = undefined

            

            //encode adverts ids
            const serializedAdverts = user.adverts.map(advertisement => ({
                ...advertisement.dataValues,
                id: encode(advertisement.id),
                userID: encode(advertisement.userID),

                images: advertisement.images.map(image => {
                    return {
                        ...image.dataValues,
                        id: encode(image.id)
                    }
                })
            }))

            return res.json({ 
                success: true, 
                ...user.dataValues, 
                id: encodedID ,
                adverts: serializedAdverts
            })
        }
        catch(err){

            console.log(err)
            return res.status(500).json({
                success: false,
                message: "Erro no servidor. Tente novamente"
            })
        }

    },
    //refresh token
    refreshAuthenticate: async(req,res) => {
        try{
            const {refresh: refreshToken} = req.headers
            const {user : currentID} = req.body;


            if(!refreshToken || !currentID)
                return res.status(400).json({
                    success: false,
                    message: "parâmetros ausentes"
                })

            const user = await getCache(Cache, refreshToken)
            
            if(user != currentID || user === null)
                return res.status(400).json({
                    success: false,
                    message: "token inválido"
                })
            
            const userExists = await User.findByPk(decode(user), {
                attributes: ['id']
            })

            if(!userExists)
                return res.status(400).json({
                    success: false,
                    message: "Usuário não encontrado"
                })

            await destroyCache(Cache,refreshToken)
            
            const newRefreshToken = generateRefreshToken()
            await setCache(Cache, newRefreshToken, user, 2592000)


            res.setHeader('Authorization', 'Bearer ' + generateToken({user}, 300))
            res.setHeader('Refresh', newRefreshToken)

            return res.json({ success : true })
        }
        catch(err){
            return res.status(500).json({
                success: false,
                message: "Erro no servidor. Tente novamente"
            })
        }
    },
    logout: async(req,res) => {
        const {refresh} = req.headers

        if(!refresh)
            return res.status(400).json({
                success: false,
                message: "token ausente"
            })

        destroyCache(Cache,refresh)

        return res.json()


    },
    //send password reset email
    forgotPassword: async(req,res) => {
        try{
            const {email} = req.body;

            if(!email)
                return res.status(400).json({
                    success: false,
                    message: "Email é obrigatório"
                })
            
            const user = await User.findOne({
                where: {email},
                attributes: ['email', 'name']
            })

            if(!user)
            return res.status(400).json({
                success: false,
                message: "Nenhum usuário foi encontrado com o email informado"
            })

            const tokenResetPassword = generateRefreshToken()

            //saving the generated token valid for 24 hours
            await setCache(Cache, tokenResetPassword, email, 86400)

            try{
                await sendResetPasswordMail({name: user.name, to: email, token: tokenResetPassword})
            }
            catch(err){
                await destroyCache(Cache, tokenResetPassword)
                return res.status(400).json({
                    success: false,
                    message: "Não foi possível enviar o email para redefinição de senha. Entre em contato"
                })
            }

            return res.json({
                success: true,
                message: "Foi enviado um email contendo um link para a redefinição de senha"
            })
        }
        catch(err){
            return res.status(500).json({
                success: false,
                message: "Erro no servidor. Tente novamente"
            })
        }
    },
    //change the password via the link sent to the email
    refreshPassword: async(req,res) => {
        try{
            const {password} = req.body
            const {tokenResetPassword} = req.params

            if(!password || password.length < 5 || password.length > 20)
                return res.status(400).json({
                    success: false,
                    message: "Senha é obrigatória e deve conter entre 5 e 20 caracteres"
                })
            
            if(!tokenResetPassword)
                return res.status(400).json({
                    success: false,
                    message: "Link para redefinição de senha inválido"
                })
            
            const email = await getCache(Cache, tokenResetPassword)
            
            if(!email)
                return res.status(400).json({
                    success: false,
                    message: "O link para redefinição de senha expirou"
                })
            
            const user = await User.findOne({
                where: {email},
                attributes: ['id', 'password']
            })

            if(!user)
                return res.status(400).json({
                    success: false,
                    message: "Usuário não encontrado"
                })

            user.password = await bcrypt.hash(password, 10)
            await user.save()

            //after the user changes the password, the token is invalidated
            await destroyCache(Cache, tokenResetPassword)

            return res.json({
                success: true,
                message: "Senha alterada com sucesso"
            })
        }
        catch(err){
            return res.status(400).json({
                success: false,
                message: "Erro no servidor. Tente novamente"
            })
        }
    }
}