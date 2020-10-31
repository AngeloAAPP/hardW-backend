const router = require('express').Router();

const {create, update, changeAvatarUrl, changePassword, destroy} = require('../controllers/userController')

const authorizaded = require('../middlewares/authorizaded')
const upload = require('../middlewares/multer')

router
    .post('/', upload.single('image'),create)
    .put('/', authorizaded, update)
    .patch('/avatarUrl', authorizaded, upload.single('image'), changeAvatarUrl)
    .patch('/password', authorizaded, changePassword)
    .delete('/', authorizaded, destroy)

module.exports = router