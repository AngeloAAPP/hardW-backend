const {Sequelize} = require('sequelize')
const dbConfig = require('../config/database')

//import models
const User = require('./models/User')
const Address = require('./models/Address')

const connection = new Sequelize(dbConfig)

//init models
User.init(connection)
Address.init(connection)

//associate models
User.associate(connection.models)
Address.associate(connection.models)

module.exports = connection