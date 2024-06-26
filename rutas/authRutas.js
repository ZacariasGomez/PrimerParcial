const express = require('express');
const rutas = express.Router();
const Usuario = require('../modelos/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const tokensInvalidos = require('./token'); // Importar la lista de tokens inválidos y el middleware

//Registrar nuevo usuario
rutas.post('/registro', async (req, res) => {
    try {
        const { nombreusuario, correo, contrasenia } = req.body;
        const usuario = new Usuario({ nombreusuario, correo, contrasenia});
        await usuario.save();
        res.status(201).json({mensaje: 'Usuario registrado'});
    }
    catch(error){
        res.status(500).json({mensaje: error.message});
    }
});

//Inicio de sesion para el usuario
rutas.post('/iniciarsesion', async (req, res) => {
    try {
        const { correo, contrasenia } = req.body;
        const usuario = await Usuario.findOne({ correo });
        if (!usuario)
            return res.status(401).json({ error : 'Correo invalido!!!!!'});
        const validarContrasena = await usuario.compararContrasenia(contrasenia);
        if (!validarContrasena)
            return res.status(401).json({ error : 'Contrasenia invalido!!!!!'});
        
        //creacion de token 
        const token = jwt.sign({ usuarioId: usuario._id },'clave_secreta', {expiresIn: '20h'});
        res.json( {token});
    }
    catch(error){
        res.status(500).json({mensaje: error.message});
    }
});
// Cierre de sesión del usuario
rutas.post('/cerrarsesion', (req, res) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(400).json({ mensaje: 'Token no proporcionado' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(400).json({ mensaje: 'Token no proporcionado' });

    // Invalidar el token añadiéndolo a la lista de tokens inválidos
    tokensInvalidos.push(token);
    res.json({ mensaje: 'Cierre de sesión exitoso' });
});

// Verificar token
rutas.post('/verificartoken', (req, res) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(400).json({ mensaje: 'Token no proporcionado' });

    const token = authHeader.split(' ')[1];
    if (tokensInvalidos.includes(token)) {
        return res.status(401).json({ mensaje: 'Token invalidado.' });
    }

    try {
        const decodificar = jwt.verify(token, 'clave_secreta');
        res.json({ mensaje: 'Token válido', usuarioId: decodificar.usuarioId });
    } catch (error) {
        res.status(401).json({ mensaje: 'Token no válido' });
    }
});

// Endpoint para cerrar sesión
module.exports = rutas;
