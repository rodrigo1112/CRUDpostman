const express = require('express');
const bodyParser = require('body-parser');
const Joi = require('joi');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const productosSchema = Joi.object({
  nombre: Joi.string().required(),
  color: Joi.string().required(),
  precio: Joi.number().required(),
  talle: Joi.string().required()
});

const productos = [];
let nextProductId = 1;

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get('/productos/buscar/:nombre', (req, res) => {
  const searchName = req.params.nombre.toLowerCase();

  const matchedProducts = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(searchName) || producto.nombre.toLowerCase().includes(" " + searchName)
  );

  res.json(matchedProducts);
});


app.post('/productos', (req, res) => {
  const newProduct = req.body;
  const { error, value } = productosSchema.validate(newProduct);

  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  }

  const productWithId = { id: nextProductId++, ...value };
  productos.push(productWithId);
  
  res.status(201).json(productWithId);
});

app.put('/productos/:id', (req, res) => {
  const productId = req.params.id;
  const updatedProduct = req.body;

  const index = productos.findIndex(product => product.id === Number(productId));
  if (index !== -1) {
    const { error, value } = productosSchema.validate(updatedProduct);

    if (error) {
      res.status(400).json(error);
      return;
    }

    productos[index] = { ...productos[index], ...value };
    res.json(productos[index]);
  } else {
    res.status(404).send('Producto no encontrado');
  }
});

app.delete('/productos/:id', (req, res) => {
  const productId = req.params.id;

  const index = productos.findIndex(product => product.id === Number(productId));
  if (index !== -1) {
    const deletedProduct = productos.splice(index, 1)[0];
    res.json(deletedProduct);
  } else {
    res.status(404).send('Producto no encontrado');
  }
});

app.get('/productos/buscar/:nombre', (req, res) => {
  const searchName = req.params.nombre.toLowerCase();

  const matchedProducts = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(searchName)
  );

  res.json(matchedProducts);
});

app.listen(PORT, () => {
  console.log(`El servidor está corriendo en el puerto ${PORT}`);
});
