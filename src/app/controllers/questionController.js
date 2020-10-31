const Question = require('../../database/models/Question')
const Advertisement = require('../../database/models/Advertisement')
const {encode, decode} = require('../helpers/hashids') 

module.exports = {
    //create question
    create: async(req, res) => {
        const {advertisementID} = req.params

        try {

            const {question} = req.body

            const advertisement = await Advertisement.findByPk(decode(advertisementID), {
                attributes: ['id'],
                include: {
                    association: 'user',
                    attributes: ['id']
                }
            })

            if(!advertisement)
                return res.status(400).json({
                    success: false,
                    message: "Anúncio não encontrado"
                })

            //checks if the advertisement belongs to the user. The user cannot ask a question in his own advertisement
            if(advertisement.user.id === req.user)
                return res.status(400).json({
                    success: false,
                    message: "Não é possível fazer uma pergunta no seu próprio anúncio"
                })

            const asking = await Question.create({
                question,
                advertisementID: advertisement.id,
                userID: req.user
            })

            return res.status(201).json({success: true, id: encode(asking.id)})
            
        } catch(err) {
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
    //answer an advertisement question
    reply: async(req,res) => {
        const {advertisementID} = req.params
        const {questionID, answer} = req.body

        if(!questionID)
            return res.status(400).json({
                success: false,
                message: "ID da pergunta é obrigatório"
            })

        if(!answer)
            return res.status(400).json({
                success: false,
                message: "A resposta é obrigatória"
            })

        try {

            const advertisement = await Advertisement.findByPk(decode(advertisementID), {
                attributes: ['id'],
                include: [
                    {
                        association: 'user',
                        attributes: ['id']
                    },
                    {
                        association: 'questions',
                        attributes: ['id']
                    }
                ]
            })

            if(!advertisement)
                return res.status(400).json({
                    success: false,
                    message: "Anúncio não encontrado"
                })

            //checks if the advertisement belongs to the request author
            if (advertisement.user.id !== req.user){
                return res.status(403).json({
                    success: false,
                    message: "Permissão negada"
                })
            }

            const questionIds = advertisement.questions.map(question => question.id)

            //checks if the advertisement has the question
            if(!questionIds.includes(decode(questionID)))
                return res.status(400).json({
                    success: false,
                    message: "Pergunta não encontrada no anúncio selecionado"
                })

            await Question.update({answer}, {
                where: {
                    id: decode(questionID)
                }
            })

            return res.json({success: true})
            
        } catch (err) {
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
    }
}