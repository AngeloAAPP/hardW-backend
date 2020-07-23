const router = require('express').Router();

const { index } = require('../controllers/categoryController')

router
    .get('/', index)

module.exports = router
