const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/base-crud', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('Error de conexión a MongoDB:', error);
});

db.once('open', () => {
  console.log('Conexión a MongoDB establecida correctamente');
});

const productoSchema = new mongoose.Schema({
  nombre: String,
  color: String,
  precio: Number,
  talle: String,
});

const Producto = mongoose.model('Producto', productoSchema);

app.get('/productos/buscar/:nombre', async (req, res) => {
  const searchName = req.params.nombre.toLowerCase();

  try {
    const matchedProducts = await Producto.find({
      nombre: { $regex: searchName, $options: 'i' },
    });

    res.json(matchedProducts);
  } catch (error) {
    console.error('Error al buscar productos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.post('/productos', async (req, res) => {
  const newProduct = req.body;

  try {
    const productoGuardado = await Producto.create(newProduct);
    res.status(201).json(productoGuardado);
  } catch (error) {
    console.error('Error al guardar el producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.put('/productos/:id', async (req, res) => {
  const productId = req.params.id;
  const updatedProduct = req.body;

  try {
    const productoActualizado = await Producto.findByIdAndUpdate(
      productId,
      updatedProduct,
      { new: true }
    );

    if (productoActualizado) {
      res.json(productoActualizado);
    } else {
      res.status(404).send('Producto no encontrado');
    }
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.delete('/productos/:id', async (req, res) => {
  const productId = req.params.id;

  try {
    const productoEliminado = await Producto.findByIdAndRemove(productId);

    if (productoEliminado) {
      res.json(productoEliminado);
    } else {
      res.status(404).send('Producto no encontrado');
    }
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/productos', async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.listen(PORT, () => {
  console.log(`El servidor está corriendo en el puerto ${PORT}`);
});

