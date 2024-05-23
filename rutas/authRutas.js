const express = require('express');
const rutas = express.Router();
const Usuario = require('../modelos/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const TokenInvalido = new Set(); // Utilizamos un Set para almacenar tokens invalidados

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
        const token = jwt.sign({ usuarioId: usuario._id },'clave_secreta', {expiresIn: '6h'});
        res.json( {token});
    }
    catch(error){
        res.status(500).json({mensaje: error.message});
    }
});
// Cierre de sesión del usuario

// Cierre de sesión del usuario
rutas.post('/cerrarsesion', (req, res) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(400).json({ mensaje: 'Token no proporcionado' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(400).json({ mensaje: 'Token no proporcionado' });

    // Invalidar el token
    TokenInvalido.add(token);
    res.json({ mensaje: 'Cierre de sesión exitoso, elimine el token del almacenamiento del cliente' });
});

// Middleware para verificar si un token está invalidado
const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(400).json({ mensaje: 'Token no proporcionado' });

    const token = authHeader.split(' ')[1];
    if (TokenInvalido.has(token)) return res.status(401).json({ mensaje: 'Token invalidado' });

    jwt.verify(token, 'clave_secreta', (err, decoded) => {
        if (err) return res.status(401).json({ mensaje: 'Token no válido' });
        req.usuario = decoded;
        next();
    });
};

// Endpoint para verificar el token
rutas.post('/verificartoken', verificarToken, (req, res) => {
    res.json({ mensaje: 'Token válido', usuarioId: req.usuario.usuarioId });
});

// Endpoint para cerrar sesión
module.exports = rutas;