const express = require('express');
const request = require('supertest');
const productoRutas = require('../../rutas/productoRutas');
const mongoose  = require('mongoose');
const ProductoModel = require('../../modelos/Producto');
const CategoriaModel = require('../../modelos/Categoria');
const sinon = require('sinon')
const app = express();
app.use(express.json());
app.use('/productos', productoRutas);

describe('Pruebas Unitarias para las consultas', () => {
    //se ejecuta antes de iniciar las pruebas
    beforeEach(async () => {
        await mongoose.connect('mongodb://localhost:27017/primerparcial',{
            useNewUrlParser : true,
            useUnifiedTopology: true,            
        });
        // await ProductoModel.deleteMany({});
        // await CategoriaModel.deleteMany({});
    });
    // al finalziar las pruebas
    afterAll(() => {
        return mongoose.connection.close();
});
test('Debería devolver el reporte de cantidad por categoría: GET /productos/cantidadPorCategoria', async () => {
    // Crear categorías de prueba
    const categoria1 = await CategoriaModel.create({ nombre: 'Materiales' });
    const categoria2 = await CategoriaModel.create({ nombre: 'Equipos' });
    const categoria3 = await CategoriaModel.create({ nombre: 'Herramientas'});

    // Crear productos de prueba
    await ProductoModel.create({ nombre: 'foco', marca: 'everleo', descripcion: 'led 12w', cantidad: 10, categoria: categoria1._id });
    await ProductoModel.create({ nombre: 'foco', marca: 'brillante', descripcion: 'led 14w', cantidad: 5, categoria: categoria1._id });
    await ProductoModel.create({ nombre: 'camara', marca: 'dahua', descripcion: '180° full hd', cantidad: 7, categoria: categoria2._id });
    await ProductoModel.create({ nombre: 'alicate', marca: 'tramontina', descripcion: 'de punta', cantidad: 10, categoria: categoria3._id });
    await ProductoModel.create({ nombre: 'alicate', marca: 'tramontina', descripcion: 'de corte', cantidad: 10, categoria: categoria3._id });

    // Hacer la solicitud
    const res = await request(app).get('/productos/cantidadPorCategoria');

    // Verificar la respuesta
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(3);

    const reporte1 = res.body.find(r => r.categorias.nombre === 'Materiales');
    const reporte2 = res.body.find(r => r.categorias.nombre === 'Equipos');
    const reporte3 = res.body.find(r => r.categorias.nombre === 'Herramientas');

    expect(reporte1.totalCantidades).toEqual(15);
    expect(reporte1.productos).toHaveLength(2);

    expect(reporte2.totalCantidades).toEqual(7);
    expect(reporte2.productos).toHaveLength(1);

    expect(reporte3.totalCantidades).toEqual(20);
    expect(reporte3.productos).toHaveLength(2);
});

test('Debería devolver un error 500 si ocurre un error', async () => {
    
    // Stub para simular un error
    const categoriaStub = sinon.stub(CategoriaModel, 'find').rejects(new Error('Error al obtener las categorías'));

    // Hacer la solicitud
    const res = await request(app).get('/productos/cantidadPorCategoria');

    // Verificar la respuesta
    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty('mensaje', 'Error al obtener las categorías');

    // Restaurar el stub
    categoriaStub.restore();
});
});