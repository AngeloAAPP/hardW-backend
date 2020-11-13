const router = require('express').Router();

const {authenticate, refreshAuthenticate,logout, forgotPassword, refreshPassword} = require('../controllers/authController')

router
    .post('/', authenticate)
    .post('/refresh', refreshAuthenticate)
    .post('/logout', logout)
    .post('/forgotPassword', forgotPassword)
    .post('/refreshPassword/:tokenResetPassword', refreshPassword)

module.exports = router