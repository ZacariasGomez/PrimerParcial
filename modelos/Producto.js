const mongoose = require('mongoose');
//definir el esquema
const productoSchema = new mongoose.Schema ({
    // nombre: { type: String, require: true}
    nombre: String,
    marca: String,
    descripcion: String,
    cantidad: Number,
});

const ProductoModel = mongoose.model('Producto',productoSchema, 'productos');
module.exports = ProductoModel;