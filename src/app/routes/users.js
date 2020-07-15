const router = require('express').Router();

const {create, destroy} = require('../controllers/userController')

router.post('/', create)
router.delete('/', destroy)

module.exports = router