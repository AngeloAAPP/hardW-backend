const {Sequelize} = require('sequelize')
const dbConfig = require('../config/database')

//import models
const User = require('./models/User')
const Address = require('./models/Address')
const Category = require('./models/Category')
const Subcategory = require('./models/Subcategory')
const Advertisement = require('./models/Advertisement')
const AdvertImage = require('./models/AdvertImage')
const Question = require('./models/Question')

const connection = new Sequelize(dbConfig)

//init models
User.init(connection)
Address.init(connection)
Category.init(connection)
Subcategory.init(connection)
Advertisement.init(connection)
AdvertImage.init(connection)
Question.init(connection)

//associate models
User.associate(connection.models)
Address.associate(connection.models)
Category.associate(connection.models)
Subcategory.associate(connection.models)
Advertisement.associate(connection.models)
AdvertImage.associate(connection.models)
Question.associate(connection.models)

module.exports = connection