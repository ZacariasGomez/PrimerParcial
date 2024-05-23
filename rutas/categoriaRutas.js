const express = require('express');
const rutas = express.Router();
const CategoriaModel = require('../modelos/Categoria');
const UsuarioModel = require('../modelos/Usuario');

//CROUD PARA LA COLLECION CATEGORIA

//endpoint 1 mostrar todas las categorias
rutas.get('/leerCategoria', async (req, res) => {
    try  {
        const categoria = await  CategoriaModel.find();
        res.json(categoria);
    } catch (error){
        res.status(500).json({mensaje: error.message});
    }
});

//endpoint 2 Crear nueva categroia
rutas.post('/crearCategoria', async (req, res) => {
    const categoria = new CategoriaModel({
        nombre: req.body.nombre
    })
    try {
        const nuevaCategoria = await categoria.save();
        res.status(201).json(nuevaCategoria);
    } catch (error) {
        res.status(400).json({ mensaje :  error.message})
    }
});

//endpoint 3. Actualizar categroia
rutas.put('/editarCategoria/:id', async (req, res) => {
    try {
        const categoriaEditada = await CategoriaModel.findByIdAndUpdate(req.params.id, req.body, { new : true });
        if (!categoriaEditada)
            return res.status(404).json({ mensaje : 'Categoria no encontrada!!!'});
        else
            return res.status(201).json(categoriaEditada);

    } catch (error) {
        res.status(400).json({ mensaje :  error.message})
    }
})

// ENDPOINT 4. eliminar categoria
rutas.delete('/eliminarCategoria/:id',async (req, res) => {
    try {
       const categoriaEliminado = await CategoriaModel.findByIdAndDelete(req.params.id);
       if (!categoriaEliminado)
            return res.status(404).json({ mensaje : 'Categoria no encontrada!!!'});
       else 
            return res.json({mensaje :  'La categoria a sido eliminado exitosamente'});    
       } 
    catch (error) {
        res.status(500).json({ mensaje :  error.message})
    }
});
// exportando modulo rutas 
module.exports = rutas;