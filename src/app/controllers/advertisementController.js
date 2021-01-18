const Advertisement = require('../../database/models/Advertisement')
const fs = require('fs')
const { cloudinary } = require('../../config/cloudinary')
const DBconnection = require('../../database')
const { encode, decode } = require('../helpers/hashids')
const path = require('path')
const AdvertImage = require('../../database/models/AdvertImage')
const {Op} = require('sequelize')

function dropTemporaryImages(images) {
    images.forEach(image => {
        fs.unlink(path.resolve(__dirname, '..', '..', '..', 'temp', image.filename), (err) => {
            if (err)
                console.log("Falha ao deletar arquivo")
        })
    });
}

module.exports = {
    //returns filtered adverts
    index: async(req,res) => {

        //filters
        const categoryID = req.query.categoryID ? [req.query.categoryID] : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        const subcategoryID = req.query.subcategoryID ? [req.query.subcategoryID] : [null,1,2,3]
        const city = req.query.city || '%'
        const uf = req.query.uf || '%'
        const search = req.query.search || '%'
        const min = req.query.min || 0
        const max = req.query.max || 99999999

        try {
            //search all adverts
            const adverts = await Advertisement.findAll({
                where: {
                    status: 'Ativo',
                    name: {
                        [Op.iLike]: search
                    },
                    categoryID: {
                        [Op.in]: categoryID
                    },
                    subcategoryID: {
                        [Op.or]: subcategoryID
                    },
                    price: {
                        [Op.gte]: min,
                        [Op.lte]: max
                    }
                },
                
                attributes: ['id', 'name', 'price', 'createdAt', 'categoryID', 'subcategoryID'],
                order: [['createdAt', 'DESC']],
                include: [
                    {
                        association: 'images',
                        attributes: ['url'],
                        limit: 1,
                    },
                    {
                        association: 'user',
                        required: true,
                        attributes: ['name'],
                        include: {
                            association: 'address',
                            attributes: ['neighbourhood', 'city', 'uf'],
                            where: {
                                city: {
                                    [Op.like]: city
                                },
                                uf: {
                                    [Op.like]: uf
                                }
                            },
                        },
                    }
                ]
            })

            //encode advertisement id
            const serializedAdverts = adverts.map(advertisement => ({
                    ...advertisement.dataValues,
                    id: encode(advertisement.id)
                }
            )) 
            return res.json(serializedAdverts)
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: "Parâmetros inválidos"
            })
        }
    },
    //create advertisement
    create: async (req, res) => {

        let uploadedImages = []
        let images = []

        try {
            const result = await DBconnection.transaction(async transaction => {

                const { name, price, description, categoryID, subcategoryID } = req.body
                const advertisement = await Advertisement.create({ name, price, description, categoryID, subcategoryID, userID: req.user }, { transaction })

                try {
                    if (req.files.length > 0) {

                        //upload images
                        for (const image of req.files) {
                            const { secure_url, public_id } = await cloudinary.uploader.upload(path.resolve(__dirname, '..', '..', '..', 'temp', image.filename), {
                                folder: 'posts'
                            })
                            uploadedImages.push({ secure_url, public_id })
                        }
                    }
                } catch (err) {
                    throw new Error("Falha ao realizar upload de imagens")
                }

                if (uploadedImages.length > 0) {
                    //inserts each uploaded image into the database
                    for (const image of uploadedImages) {
                        const advertImage = await AdvertImage.create({
                            url: image.secure_url,
                            publicID: image.public_id,
                            advertisementID: advertisement.id
                        }, { transaction })

                        images.push(advertImage)
                    }
                }

                if (images.length > 0) {
                    //encode image id
                    const serializedImages = images.map(image => (
                        {
                            id: encode(image.id),
                            url: image.url
                        }
                    ))
                    images = serializedImages
                }

                return {
                    ...advertisement.dataValues,
                    id: encode(advertisement.id),
                    userID: encode(advertisement.userID),
                    images
                }

            })

            dropTemporaryImages(req.files)
            return res.status(201).json({ success: true, ...result })

        } catch (err) {

            dropTemporaryImages(req.files)

            if (uploadedImages.length > 0) {
                for (const image of uploadedImages) {
                    try {
                        await cloudinary.uploader.destroy(image.public_id)
                    } catch (error) {
                    }

                }
            }

            try {
                let error = err.errors[0].message;
                return res.status(400).json({ success: false, message: error })
            }
            //if the error message was generated by the throw new Error command
            catch (e) {
                return res.status(400).json({ success: false, message: err.toString() })
            }
        }

    },
    //return specific advertisement
    show: async(req,res) => {
        const {advertisementID} = req.params

        const advertisement = await Advertisement.findByPk(decode(advertisementID), {
            attributes: ['name', 'description', 'price', 'status', 'createdAt'],
            include: [
                {
                    association: 'user',
                    attributes: ['id','name','lastName', 'whatsapp', 'avatarUrl', 'createdAt'],
                    include: {
                        association: 'address',
                        attributes: ['neighbourhood', 'city', 'uf']
                    }
                },
                {
                    association: 'category',
                    attributes: ['name','imageUrl'],
                },
                {
                    association: 'subcategory',
                    attributes: ['name','imageUrl'],
                },
                {
                    association: 'images',
                    attributes: ['url']
                },
                {
                    association: 'questions',
                    attributes: ['id', 'question', 'answer', 'createdAt', 'updatedAt'],
                    separate: true,
                    order: [['createdAt', 'DESC']]
                }
            ]
        })

        if(!advertisement)
            return res.status(400).json({
                success: false,
                message: "Anúncio não encontrado"
            })

        //encode question id
        const questions = advertisement.questions.map(question => ({
            ...question.dataValues,
            id: encode(question.id)
        }))


        return res.json({
            success: true,
            ...advertisement.dataValues,
            questions,
            user: {
                ...advertisement.user.dataValues,
                id: encode(advertisement.user.id)
            }
        })
    },
    //removes an image from the advertisement
    dropImage: async (req, res) => {
        const { imageID } = req.body
        const {advertisementID} = req.params

        if (!imageID)
            return res.status(400).json({
                success: false,
                message: "ID da imagem é obrigatório"
            })

        try {
            const advertisement = await Advertisement.findByPk(decode(advertisementID), {
                attributes: ['id'],
                include: [
                    {
                        association: 'images',
                        attributes: ['id', 'publicID']
                    },
                    {
                        association: 'user',
                        attributes: ['id']
                    }
                ]
            })

            if (!advertisement)
                return res.status(400).json({
                    success: false,
                    message: "Anúncio não encontrado"
                })

            const images = advertisement.dataValues.images.map(image => image.id)

            //checks if the advertisement has the image
            if (!images.includes(decode(imageID)))
                return res.status(400).json({
                    success: false,
                    message: "Imagem não encontrada ou não pertence ao anúncio selecionado"
                })

            //checks if the advertisement belongs to the request author
            if (advertisement.user.id !== req.user)
                return res.status(403).json({
                    success: false,
                    message: "Permissão negada"
                })

            const [image] = advertisement.dataValues.images.filter(image => image.id === decode(imageID))

            try {
                await cloudinary.uploader.destroy(image.publicID)
                await AdvertImage.destroy({
                    where: {
                        id: image.id
                    }
                })
            } catch (err) { 
                return res.status(400).json({
                    success: false,
                    message: "Falha ao excluir imagem"
                })
            }

            return res.json({ success: true })

        } catch (err) {
            return res.status(500).json({ success: false, message: "Erro no servidor. Tente novamente" })
        }
    },
    //add images to an advertisement
    addImages: async (req, res) => {
        const { advertisementID } = req.params
        let uploadedImages = []
        let images = []
        
        if(!req.files.length > 0)
            return res.status(400).json({
                success: false,
                message: "Imagem ausente"
            })

        try {
            const advertisement = await Advertisement.findByPk(decode(advertisementID), {
                attributes: ['id'],
                include: [
                    {
                        association: 'images',
                        attributes: ['id', 'publicID']
                    },
                    {
                        association: 'user',
                        attributes: ['id']
                    }
                ]
            })

            if (!advertisement){
                dropTemporaryImages(req.files)

                return res.status(400).json({
                    success: false,
                    message: "Anúncio não encontrado"
                })
            }

            //checks if the advertisement belongs to the request author
            if (advertisement.user.id !== req.user){
                dropTemporaryImages(req.files)

                return res.status(403).json({
                    success: false,
                    message: "Permissão negada"
                })
            }


            if(req.files.length > 6 || (req.files.length + advertisement.images.length) > 6){
                dropTemporaryImages(req.files)
                
                return res.status(400).json({
                    success: false,
                    message: "São permitidas no máximo 6 imagens por anúncio"
                })
            }

            try {
                //upload images
                for (const image of req.files) {
                    const { secure_url, public_id } = await cloudinary.uploader.upload(path.resolve(__dirname, '..', '..', '..', 'temp', image.filename), {
                        folder: 'posts'
                    })
                    uploadedImages.push({ secure_url, public_id })
                }
            } catch (err) {
                throw new Error("Falha ao realizar upload de imagens")
            }

            for (const image of uploadedImages) {
                //inserts each uploaded image into the database
                const advertImage = await AdvertImage.create({
                    url: image.secure_url,
                    publicID: image.public_id,
                    advertisementID: advertisement.id
                })

                images.push(advertImage)
            }

            //encode image id
            const serializedImages = images.map(image => (
                {
                    id: encode(image.id),
                    url: image.url
                }
            ))
            
            dropTemporaryImages(req.files)
            return res.json({success: true, images: serializedImages})

        } catch (err) {
            dropTemporaryImages(req.files)
            return res.status(500).json({ success: false, message: "Erro no servidor. Tente novamente" })
        }
    }
    ,
    //update advertisement
    update: async(req, res) => {
        const {name, price, description, status} = req.body
        const {advertisementID} = req.params

        try {

            const advertisement = await Advertisement.findByPk(decode(advertisementID), {
                attributes: ['id'],
                include: {
                    association: 'user',
                    attributes: ['id']
                }
            })

            if (!advertisement)
                return res.status(400).json({
                    success: false,
                    message: "Anúncio não encontrado"
                })

            //checks if the advertisement belongs to the request author
            if (advertisement.user.id !== req.user)
                return res.status(403).json({
                    success: false,
                    message: "Permissão negada"
                })
            
            await advertisement.update({name, price, description, status})
            return res.json({success: true})
            
        } catch (err) {
            try{
                let error = err.errors[0].message;
                return res.status(400).json({success: false, message: error})
            }
            //if the error message was generated by the throw new Error command
            catch(e){
                return res.status(400).json({success: false, message: err.toString()})
            }   
        }
    },
    //delete advertisement
    destroy: async (req, res) => {
        const { advertisementID } = req.params

        try {
            const advertisement = await Advertisement.findByPk(decode(advertisementID), {
                attributes: ['id'],
                include: [
                    {
                        association: 'images',
                        attributes: ['id', 'publicID']
                    },
                    {
                        association: 'user',
                        attributes: ['id']
                    }
                ]
            })

            if (!advertisement)
                return res.status(400).json({
                    success: false,
                    message: "Anúncio não encontrado"
                })

            //checks if the advertisement belongs to the request author
            if (advertisement.user.id !== req.user)
                return res.status(403).json({
                    success: false,
                    message: "Permissão negada"
                })

            //deletes ad images uploaded to cloudinary
            for (const image of advertisement.images) {
                try {
                    await cloudinary.uploader.destroy(image.publicID)
                } catch (err) { }
            }

            await advertisement.destroy()
            await advertisement.save()

            return res.json({ success: true })
        } catch (err) {
            return res.status(500).json({ success: false, message: "Erro no servidor. Tente novamente" })
        }
    }
}