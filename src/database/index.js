const {Sequelize} = require('sequelize')
const dbConfig = require('../config/database')

//import models
const User = require('./models/User')
const Address = require('./models/Address')
const Category = require('./models/Category')
const Subcategory = require('./models/Subcategory')

const connection = new Sequelize(dbConfig)

//init models
User.init(connection)
Address.init(connection)
Category.init(connection)
Subcategory.init(connection)

//associate models
User.associate(connection.models)
Address.associate(connection.models)
Category.associate(connection.models)
Subcategory.associate(connection.models)

module.exports = connection