const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    trim: true
  },
  categoria:{
    type: String,
    required: [true, "La categoría es obligatoria"],
    trim: true
  },
  precio: {
    type: Number,
    required: [true, "El precio es obligatorio"],
    min: 0
},
  imagenUrl: {
    type: String
},
  descripcion: {
    type: String
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  destacado:{
    type: Boolean,
    default: false
  },
  fabricacion:[{
    label:{
        type: String,
        required: true,
        trim: true
    },
    value:{
        type: String,
        required: true,
        trim: true
    }
  }]  
}, 
{ timestamps: true });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;