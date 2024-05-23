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
const tokensInvalidos = require('./rutas/token');
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


//middleware para la autenticacion autenticacion
const autenticar = async (req, res, next)=>{
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token)
            res.status(401).json({mensaje: 'No existe el token de autenticacion'});

          // Verificar si el token ha sido invalidado
          if (tokensInvalidos.includes(token)) {
            return res.status(401).json({ mensaje: 'El Token ya no es válido..!!!' });
        }
          // Verificar el token y obtener los datos decodificados
        const decodificar = jwt.verify(token, 'clave_secreta');

         // Buscar al usuario en la base de datos
        req.usuario = await  Usuario.findById(decodificar.usuarioId);

        // Continuar con la ejecución de la siguiente función middleware
        next(); 
    }
    catch(error){
        res.status(400).json({ error: error.message});
    }
};
module.exports = tokensInvalidos;

// con autenticacion
app.use('/auth',authRutas)
app.use('/productos',autenticar, productoRutas);
app.use('/categorias',autenticar, categoriaRutas);

//utilizar las rutas de productos
//app.use('/productos', productoRutas);
//utilizar las rutas de categroias
//app.use('/categorias', categoriaRutas);

// Exportar la lista de tokens inválidos y el middleware
