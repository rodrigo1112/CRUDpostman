const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { Producto, productoValidationSchema } = require('./producto'); // Importar el esquema y el modelo de producto

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

app.post('/productos', async (req, res) => {
  const newProduct = req.body;

  // Validar la solicitud usando el esquema de validación de Joi
  const { error } = productoValidationSchema.validate(newProduct);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

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

