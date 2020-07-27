const router = require('express').Router();

const {create, destroy} = require('../controllers/advertisementController')


const authenticated = require('../middlewares/authenticated')
const authorizaded = require('../middlewares/authorizaded')
const upload = require('../middlewares/multer')

router
    .use(authenticated)
    .post('/:userID',authorizaded, upload.array('image', 6),create)
    .delete('/:userID',authorizaded, destroy)

module.exports = router