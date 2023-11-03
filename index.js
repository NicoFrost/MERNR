const express = require('express');
// traemos las variables de entorno
require('dotenv').config();

const { dbConnection} = require('./database/config')
const cors = require('cors')


// Crear servidor de express
const app = express();

// Base de datos
dbConnection()

// CORS
app.use(cors())

// Lectura y parseo del body
app.use(express.json())

// Directorio publico
app.use(express.static('public'))

// Rutas
app.use('/api/auth',require('./routes/auth'))
app.use('/api/events',require('./routes/events'))


// Escuchar peticiones
app.listen(process.env.PORT,'',() => {
    console.log('Servidor corriendo en puerto ' + 3001);
})