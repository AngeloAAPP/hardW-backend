const router = require('express').Router()

//import routes
const users = require('./app/routes/users')
const authenticate = require('./app/routes/authenticate')
const addresses = require('./app/routes/addresses')

router.use('/users', users)
router.use('/authenticate', authenticate)
router.use('/addresses', addresses)

module.exports = router