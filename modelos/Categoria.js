const mongoose = require('mongoose');
//definir el esquema
const categoriaSchema = new mongoose.Schema ({
    // nombre: { type: String, require: true}
    descripcion: String
});

const CategoriaModel = mongoose.model('Categoria',categoriaSchema, 'categoria');
module.exports = CategoriaModel;