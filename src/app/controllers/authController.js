const bcrypt = require('bcrypt')
const User = require('../models/User')
const {generateToken, generateRefreshToken} = require('../helpers/tokens')
const {encode} = require('../helpers/hashids')
const {client: Cache, setCache, getCache, destroyCache} = require('../helpers/redis')
const { findOne } = require('../models/User')

module.exports = {
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
                attributes: ['id', 'email', 'password']
            })

            if(!user)
                return res.status(401).json({
                    success: false,
                    message: "Nenhum usuário foi encontrado com o email informado"
                })

            if(! await bcrypt.compare(password, user.password))
                return res.status(401).json({
                    success: false,
                    message: "Senha incorreta"
                })

            const refreshToken = generateRefreshToken()

            res.setHeader('Authorization', 'Bearer ' + generateToken({user: encode(user.id)}, 300))
            res.setHeader('Refresh', refreshToken)

            await setCache(Cache, refreshToken, encode(user.id), 2592000)

            return res.json({ success: true })
        }
        catch(err){
            return res.status(500).json({
                success: false,
                message: "Erro no servidor. Tente novamente"
            })
        }

    },
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
                return res.status(401).json({
                    success: false,
                    message: "token inválido"
                })

            await destroyCache(Cache,refreshToken)
            
            const newRefreshToken = generateRefreshToken()


            res.setHeader('Authorization', generateToken({user}, 300))
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
    forgotPassword: async(req,res) => {
        try{
            const {email} = req.body;

            if(!email)
                return res.status(400).json({
                    success: false,
                    message: "Email é obrigatório"
                })
            
            const user = User.findOne({
                where: {email}
            })

            if(!user)
            return res.status(400).json({
                success: false,
                message: "Nenhum usuário foi encontrado com o email informado"
            })

            const tokenResetPassword = generateRefreshToken()

            //saving the generated token valid for 24 hours
            await setCache(Cache, tokenResetPassword, email, 86400)

            //enviar email com o link contendo o token

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
    refreshPassword: async(req,res) => {
        const {password} = req.body
        const {tokenResetPassword} = req.params

        const email = await getCache(Cache, tokenResetPassword)
        const user = await User.findOne({
            where: {email}
        })

        user.password = bcrypt.hash(password, 10)
        user.save()

        return res.json({
            success: true,
            message: "Senha alterada com sucesso"
        })
        
    }
}