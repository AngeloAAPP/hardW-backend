const router = require('express').Router();

const {create, update, changeAvatarUrl, changePassword, destroy} = require('../controllers/userController')


const authenticated = require('../middlewares/authenticated')
const authorizaded = require('../middlewares/authorizaded')
const upload = require('../middlewares/multer')

router
    .post('/', upload.single('image'),create)
    .put('/:userID', authenticated, authorizaded, update)
    .patch('/:userID/avatarUrl',authenticated, authorizaded, upload.single('image'), changeAvatarUrl)
    .patch('/:userID/password',authenticated, authorizaded, changePassword)
    .delete('/:userID', authenticated, authorizaded, destroy)

module.exports = router