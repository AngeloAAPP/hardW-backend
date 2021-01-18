const router = require('express').Router();

const {create, index, show, addImages, dropImage, update, destroy} = require('../controllers/advertisementController')
const {create: createQuestion, reply} = require('../controllers/questionController')


const authorizaded = require('../middlewares/authorizaded')
const upload = require('../middlewares/multer')

router 
    .get('/', index)
    .get('/:advertisementID', (req, res, next) => {req.optionalAuthenticate = true; return next()}, authorizaded, show)
    .post('/', authorizaded,upload.array('image', 6),create)
    .post('/:advertisementID/image', authorizaded, upload.array('image', 6),addImages)
    .post('/:advertisementID/question',authorizaded, createQuestion)
    .put('/:advertisementID/answer', authorizaded, reply)
    .put('/:advertisementID', authorizaded, update)
    .delete('/:advertisementID/image', authorizaded, dropImage)
    .delete('/:advertisementID', authorizaded, destroy)

module.exports = router