const mongoose = require('mongoose');
//definir el esquema
const categoriaSchema = new mongoose.Schema ({
    // nombre: { type: String, require: true}
    nombre: String
});

const CategoriaModel = mongoose.model('Categoria',categoriaSchema, 'categoria');
module.exports = CategoriaModel;