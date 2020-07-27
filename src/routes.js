const router = require('express').Router()

//import routes
const users = require('./app/routes/users')
const authenticate = require('./app/routes/authenticate')
const addresses = require('./app/routes/addresses')
const categories = require('./app/routes/categories')
const adverts = require('./app/routes/adverts')

router.use('/users', users)
router.use('/authenticate', authenticate)
router.use('/addresses', addresses)
router.use('/categories', categories)
router.use('/adverts', adverts)

module.exports = router