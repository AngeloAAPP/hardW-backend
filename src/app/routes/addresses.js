const router = require('express').Router();

const {create, destroy} = require('../controllers/addressController')


const authorizate = require('../middlewares/authorizate')

router
    .use(authorizate)
    .post('/:userID', create)
    .delete('/:userID', destroy)

module.exports = router