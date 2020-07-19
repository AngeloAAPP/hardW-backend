const router = require('express').Router();

const {create, destroy} = require('../controllers/userController')
const {authenticate, refreshAuthenticate, forgotPassword, refreshPassword} = require('../controllers/authController')

const authorizate = require('../middlewares/authorizate')

router
    .post('/', create)
    .post('/authenticate', authenticate)
    .post('/authenticate/refresh', refreshAuthenticate)
    .post('/authenticate/forgotPassword', forgotPassword)
    .post('/authenticate/refreshPassword/:tokenResetPassword', refreshPassword)
    .delete('/', authorizate, destroy)

module.exports = router