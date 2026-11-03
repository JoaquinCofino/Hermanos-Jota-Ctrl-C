const mongoose = require("mongoose");

const categoriaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    unique: true,
    trim: true
  }
}, { timestamps: true });

const Categoria = mongoose.model("Categoria", categoriaSchema);

module.exports = Categoria;
