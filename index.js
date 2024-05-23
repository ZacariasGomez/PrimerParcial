//importacion de libs
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const authRutas = require('./rutas/authRutas');
const Usuario = require('./modelos/Usuario');
require('dotenv').config();
const app = express();
// ruta
const productoRutas = require('./rutas/productoRutas');
const categoriaRutas = require('./rutas/categoriaRutas');
//configuraciones de environment
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
//manejo de JSON
app.use(express.json());

//CONEXION CON MONGODB\
mongoose.connect(MONGO_URI)
.then(() => {
        console.log('Conexion exitosa');
        app.listen(PORT, () => {console.log("Servidor express corriendo en el puerto: "+PORT)})
    }
).catch( error => console.log('error de conexion', error));

// Set para almacenar tokens invalidados
const TokenInvalido = new Set();

//middleware para la autenticacion autenticacion
const autenticar = async (req, res, next)=>{
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token)
            res.status(401).json({mensaje: 'No existe el token de autenticacion'});

        const decodificar = jwt.verify(token, 'clave_secreta');

        if (TokenInvalido.has(token)) {
            return res.status(401).json({ mensaje: 'Token invalidado' });
        }
        req.usuario = await  Usuario.findById(decodificar.usuarioId);
        next();
    }
    catch(error){
        res.status(400).json({ error: error.message});
    }
};


// con autenticacion
app.use('/auth',authRutas)
app.use('/productos',autenticar, productoRutas);
app.use('/categorias',autenticar, categoriaRutas);

//utilizar las rutas de productos
//app.use('/productos', productoRutas);
//utilizar las rutas de categroias
//app.use('/categorias', categoriaRutas);