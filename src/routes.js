const router = require('express').Router()

//import routes
const users = require('./app/routes/users')

router.use('/users', users)

module.exports = router