const {Sequelize} = require('sequelize')
const dbConfig = require('../config/database')

//import models
const User = require('./models/User')

const connection = new Sequelize(dbConfig)

//init models
User.init(connection)

module.exports = connection