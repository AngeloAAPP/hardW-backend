const router = require('express').Router();

const {authenticate, refreshAuthenticate, forgotPassword, refreshPassword} = require('../controllers/authController')

router
    .post('/', authenticate)
    .post('/refresh', refreshAuthenticate)
    .post('/forgotPassword', forgotPassword)
    .post('/refreshPassword/:tokenResetPassword', refreshPassword)

module.exports = router