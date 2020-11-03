const express = require('express')
const app = express()
const cors = require('cors')

if(process.env.NODE_ENV === 'development')
{
    require('dotenv').config()
    const morgan = require('morgan')
    app.use(morgan('dev'))
}

const routes = require('./routes')
require('./database')

app.use(cors())
app.use(express.json())
app.use(routes)

app.listen(process.env.PORT || 3001, () =>{
    console.log("Servidor iniciado")
})