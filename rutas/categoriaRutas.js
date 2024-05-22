const express = require('express');
const rutas = express.Router();
const CategoriaModel = require('../modelos/Categoria');
const UsuarioModel = require('../modelos/Usuario');

//endpoint 1 Leer todas las categorias
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
        descripcion: req.body.descripcion
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
/*
// ENDPOINT 5 CONTAR PRODUCTOS DONDE LA CANTIDAD SEA  MAYOR A 50 
rutas.get('/totalProductos/:cantidad', async (req, res) => {
    try {
        const cantidadParametro = parseInt(req.params.cantidad); 
        const productos = await ProductoModel.find({ cantidad: { $gte: cantidadParametro } });
        const total = productos.length; 
        return res.json({ totalProductos: total, productosEncontrados: productos });
    } catch(error) {
        res.status(500).json({ mensaje: error.message });
    }
});
// ENPOINT 6 BUSCAR PRODUCTO POR MARCA
rutas.get('/porMarca/:marca', async (req, res) => {
    try {
        const productoMarca = await ProductoModel.find({ marca: new RegExp(req.params.marca, 'i')});
        return res.json(productoMarca);
    } catch(error) {
        res.status(500).json({ mensaje :  error.message})
    }
});
// ENPOINT 7 BUSCAR PRODUCTOS POR NOMBRE PERO LA CANTIDAD SEA MENOR A 10
rutas.get('/porNombre/:nombre', async (req, res) => {
    try {
        const productosNombre = await ProductoModel.find({ 
            nombre: new RegExp(req.params.nombre, 'i'),
            cantidad: { $lt: 10 } 
        });
        return res.json(productosNombre);
    } catch(error) {
        res.status(500).json({ mensaje: error.message });
    }
});
// ENPOINT 8 BUSCAR PRODCUTOS POR NOMBRE Y DESCRIPCION
rutas.get('/nombreDescripcion/:nombre/:descripcion?', async (req, res) => {
    try { let query = { nombre: new RegExp(req.params.nombre, 'i') }; 
        if(req.params.descripcion) {
            query.descripcion = new RegExp(req.params.descripcion, 'i');
        }
        const productos = await ProductoModel.find(query);
        return res.json(productos);
    } catch(error) {
        res.status(500).json({ mensaje: error.message });
    }
});

// ENPOINT 9 ORDENAR PRODUCTOS POR NOMBRE ASC
rutas.get('/ordenarProductos', async (req, res) => {
    try {
        const productosOrdenados = await ProductoModel.find().sort({ nombre: 1 });
        res.status(200).json(productosOrdenados);
    } catch(error) {
        res.status(500).json({ mensaje: error.message });
    }
});
*/

//REPORTES DE LOS PRODUCTOS 
//REPORTE 1

rutas.get('/categoriaPorUsuario/:usuarioId', async (peticion, respuesta) =>{
    const {usuarioId} = peticion.params;
    console.log(usuarioId);
    try{
        const usuario = await UsuarioModel.findById(usuarioId);
        if (!usuario)
            return respuesta.status(404).json({mensaje: 'usuario no encontrado'});
        const recetas = await RecetaModel.find({ usuario: usuarioId}).populate('usuario');
        respuesta.json(recetas);

    } catch(error){
        respuesta.status(500).json({ mensaje :  error.message})
    }
})
// exportando modulo rutas 
module.exports = rutas;