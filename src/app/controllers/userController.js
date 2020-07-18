const User = require('../models/User')
const {generateToken, generateRefreshToken} = require('../helpers/tokens')
const {encode} = require('../helpers/hashids')
const {client: Cache, setCache} = require('../helpers/redis')

module.exports = {
    create: async(req,res) => {
        const {name, lastName, whatsapp, avatarUrl, email, password} = req.body;

        try{
            const user = await User.create({
                name,
                lastName,
                whatsapp,
                avatarUrl,
                email,
                password
            })
            
            //omit password in return data
            user.password = undefined

            const refreshToken = generateRefreshToken()

            res.setHeader('Authorization', 'Bearer ' + generateToken({user: encode(user.id)}, 300))
            res.setHeader('Refresh', refreshToken)

            await setCache(Cache, refreshToken, encode(user.id), 2592000)

            return res.status(201).json({...user.dataValues, id: encode(user.id), })
        }
        catch(err){

            //get the error message generated by the sequelize validation
            try{
                let error = err.errors[0].message;
                return res.status(400).json({success: false, error})
            }
            //if the error message was generated by the throw new Error command
            catch(e){
                return res.status(400).json({success: false, message: err.toString()})
            }   
        }
    },
    destroy: async(req,res) => {

        console.log("User: ", req.user, "encode: ", encode(req.user))

        await User.destroy({where: {}})
        res.json({ sucess: true })

    }
}