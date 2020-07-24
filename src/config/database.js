try{
    require('dotenv').config()
}catch(err){}

module.exports = {
    dialect: 'postgres',
    database: 'hardw',
    host: 'localhost',
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    define: {
        timestamps: true
    }
}