const User = require('../models/User')

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
            return res.json({
                name: user.name,
                lastName: user.lastName,
                whatsapp: user.whatsapp,
                avatarUrl: user.avatarUrl,
                email: user.email,
                createdAt: user.createdAt
            })
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
        await User.destroy({where: {}})
        res.send()
    }
}