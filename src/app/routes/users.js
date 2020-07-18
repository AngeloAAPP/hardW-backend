const router = require('express').Router();

const {create, destroy} = require('../controllers/userController')
const {authenticate, refreshAuthenticate} = require('../controllers/authController')

const authorizate = require('../middlewares/authorizate')

router
    .post('/', create)
    .post('/authenticate', authenticate)
    .post('/authenticate/refresh', refreshAuthenticate)
    .delete('/', authorizate, destroy)

module.exports = router