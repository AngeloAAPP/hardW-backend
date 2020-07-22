const router = require('express').Router();

const {create, update, changeAvatarUrl, changePassword, destroy} = require('../controllers/userController')


const authorizate = require('../middlewares/authorizate')
const upload = require('../middlewares/multer')

router
    .post('/', upload.single('image'),create)
    .put('/:userID', authorizate, update)
    .patch('/:userID/avatarUrl',authorizate, upload.single('image'), changeAvatarUrl)
    .patch('/:userID/password',authorizate, changePassword)
    .delete('/:userID', authorizate, destroy)

module.exports = router