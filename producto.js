const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  nombre: String,
  color: String,
  precio: Number,
  talle: String,
});

module.exports = mongoose.model('Producto', productoSchema);
