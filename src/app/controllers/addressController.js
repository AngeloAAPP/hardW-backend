const {encode, decode} = require('../helpers/hashids')
const Address = require('../../database/models/Address')

module.exports = {
    create: async(req, res) => {
        const {name, zipCode, street, neighbourhood, uf, city } = req.body
        
        try {
            const address = await Address.create({
                name,
                zipCode,
                street,
                neighbourhood,
                uf,
                city,
                userID: req.user
            })

            address.userID = undefined

            return res.status(201).json({
                success: true,
                ...address.dataValues,
                id: encode(address.id)
            })
        } catch (err) {
            //get the error message generated by the sequelize validation
            try{
                let error = err.errors[0].message;
                return res.status(400).json({success: false, error})
            }

            catch(e){        
                return res.status(500).json({success: false, message: "Erro no servidor. Tente novamente"})
            }
        }
    },
    destroy: async(req,res) => {
        const {addressID} = req.body

        if(!addressID)
            return res.status(400).json({
                success: false,
                message: "ID do endereço é obrigatório"
            })

        
        try {
            const address = await Address.findByPk(decode(addressID))

            if(!address)
                return res.status(400).json({
                    success: false,
                    message: "Endereço não encontrado"
                })

            await address.destroy()
            await address.save()

            return res.json({ success: true })
        } catch (err) {
            return res.status(500).json({success: false, message: "Erro no servidor. Tente novamente"})
        }
        
    }
}