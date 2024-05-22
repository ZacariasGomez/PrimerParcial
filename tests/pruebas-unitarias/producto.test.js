const express = require('express');
const request = require('supertest');
const productoRutas = require('../../rutas/productoRutas');
const mongoose  = require('mongoose');
const ProductoModel = require('../../modelos/Producto');
const app = express();
app.use(express.json());
app.use('/productos', productoRutas);

describe('Pruebas Unitarias para Recetas', () => {
    //se ejecuta antes de iniciar las pruebas
    beforeEach(async () => {
        await mongoose.connect('mongodb://localhost:27017/primerparcial',{
            useNewUrlParser : true,            
        });
        await ProductoModel.deleteMany({});
    });
    // al finalziar las pruebas
    afterAll(() => {
        return mongoose.connection.close();
});
 //1er test : GET
 test('Deberia Traer todas los productos metodo: GET: leerProducto', async() =>{
    await ProductoModel.create({ nombre: 'foco', marca: 'everleo', descripcion:'led 12w', cantidad: 20});
    await ProductoModel.create({ nombre: 'foco', marca: 'everleo', descripcion:'led 14w', cantidad: 10});
    // solicitud - request
    const res =  await request(app).get('/productos/leerProducto');
    //verificar la respuesta
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(2);
}, 10000);

//2do test agregar
test('Deberia agregar un nuevo Producto: POST: /crearProducto', async() => {
    const nuevoProducto = {
        nombre: 'foco', 
        marca: 'everleo', 
        descripcion:'led 16w',
        cantidad: 5,

    };
    const res =  await request(app)
                        .post('/productos/crearProducto')
                        .send(nuevoProducto);
    expect(res.statusCode).toEqual(201);
    expect(res.body.nombre).toEqual(nuevoProducto.nombre);
});
});