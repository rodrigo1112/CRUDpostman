const mongoose = require('mongoose');
const Joi = require('joi'); 

const productoSchema = new mongoose.Schema({
  nombre: String,
  color: String,
  precio: Number,
  talle: String,
});

const productoValidationSchema = Joi.object({
  nombre: Joi.string().min(3).required(),
  color: Joi.string(),
  precio: Joi.number().min(0).required(),
  talle: Joi.string(),
});

const Producto = mongoose.model('Producto', productoSchema);

module.exports = {
  Producto,
  productoValidationSchema,
};

