const express = require('express');
const rutas = express.Router();
const ProductoModel = require('../modelos/Producto');
const UsuarioModel = require('../modelos/Usuario');
const CategoriaModel = require('../modelos/Categoria');

//endpoint 1 Leer todos los productos
rutas.get('/leerProducto', async (req, res) => {
    try  {
        const producto = await  ProductoModel.find();
        res.json(producto);
    } catch (error){
        res.status(500).json({mensaje: error.message});
    }
});
//endpoint 2 Crear nuevos productos 
rutas.post('/crearProducto', async (req, res) => {
    const producto= new ProductoModel({
        nombre: req.body.nombre,
        marca: req.body.marca,
        descripcion: req.body.descripcion,
        cantidad: req.body.cantidad,
        categoria: req.body.categoria
    })
    try {
        const nuevoProducto = await producto.save();
        res.status(201).json(nuevoProducto);
    } catch (error) {
        res.status(400).json({ mensaje :  error.message})
    }
});
//endpoint 3. Actualizar productos 
rutas.put('/editarProducto/:id', async (req, res) => {
    try {
        const productoEditado = await ProductoModel.findByIdAndUpdate(req.params.id, req.body, { new : true });
        if (!productoEditado)
            return res.status(404).json({ mensaje : 'Producto no encontrado!!!'});
        else
            return res.status(201).json(productoEditado);

    } catch (error) {
        res.status(400).json({ mensaje :  error.message})
    }
})
// ENDPOINT 4. eliminar productos
rutas.delete('/eliminarProducto/:id',async (req, res) => {
    try {
       const productoEliminado = await ProductoModel.findByIdAndDelete(req.params.id);
       if (!productoEliminado)
            return res.status(404).json({ mensaje : 'Producto no encontrado!!!'});
       else 
            return res.json({mensaje :  'El producto a sido eliminado exitosamente'});    
       } 
    catch (error) {
        res.status(500).json({ mensaje :  error.message})
    }
});
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

//REPORTES DE LOS PRODUCTOS 
//REPORTE 1

rutas.get('/productoPorCategoria/:categoriaId', async (peticion, respuesta) =>{
    const {categoriaId} = peticion.params;
    console.log(categoriaId);
    try{
        const categoria = await CategoriaModel.findById(categoriaId);
        if (!categoria)
            return respuesta.status(404).json({mensaje: 'categoria no encontrada'});
        const categorias = await ProductoModel.find({ categoria: categoriaId}).populate('categoria');
        respuesta.json(categorias);

    } catch(error){
        respuesta.status(500).json({ mensaje :  error.message})
    }
})

//REPORTES 2
//sumar cantidad de productos por categoria

rutas.get('/cantidadPorCategoria', async (req, res) => {
    try {   
        const categorias = await CategoriaModel.find();
        const reporte = await Promise.all(
            categorias.map( async ( categoria1 ) => {
                const productos = await ProductoModel.find({ categoria: categoria1._id});
                const totalCantidades = productos.reduce((sum, productos) => sum + productos.cantidad, 0);
                return {
                    productos: {
                        _id: categoria1._id,
                        descripcion: categoria1.descripcion
                    },
                    totalCantidades,
                    productos: productos.map( r => ( {
                        _id: r._id,
                        nombre: r.nombre,
                        marca: r.marca,
                        descripcion: r.descripcion,
                        cantidad: r.cantidad
                    }))
                }
            } )
        )
        res.json(reporte);
    } catch (error){
        res.status(500).json({ mensaje :  error.message})
    }
})

// exportando modulo rutas 
module.exports = rutas;