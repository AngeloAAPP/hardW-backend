const router = require('express').Router();

const {create, destroy} = require('../controllers/addressController')


const authenticated = require('../middlewares/authenticated')
const authorizaded = require('../middlewares/authorizaded')

router
    .use(authenticated)
    .post('/:userID',authorizaded, create)
    .delete('/:userID',authorizaded, destroy)

module.exports = router