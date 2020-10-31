try{
    require('dotenv').config()
}catch(err){}

const stringDB = process.env.DATABASE_URL.substring(11)

//Separa a string de conexão com o banco de dados em suas respectivas variaveis
//Não foi utilizada a string diretamente para conseguir utilizar a linha de comando do sequelize

const [username, passwordAndHost, portAndDatabase] = stringDB.split(":")
const [password, host] = passwordAndHost.split("@")
const [port, database] = portAndDatabase.split('/')

module.exports = {
    dialect: "postgres",
    host,
    port,
    username,
    password,
    database,
    dialectOptions:{
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },    
    define: {
        timestamps:true
    }
}