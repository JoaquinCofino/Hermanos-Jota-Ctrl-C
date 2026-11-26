const mongoose = require("mongoose");

// Cada item guarda una copia del nombre y del precio al momento de la compra,
// así el historial no cambia si después se edita o borra el producto.
const itemPedidoSchema = new mongoose.Schema(
  {
    producto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    nombre: {
      type: String,
      required: true
    },
    precio: {
      type: Number,
      required: true,
      min: 0
    },
    cantidad: {
      type: Number,
      required: true,
      min: 1
    }
  },
  { _id: false }
);

const pedidoSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true
    },
    items: {
      type: [itemPedidoSchema],
      validate: {
        validator: (items) => items.length > 0,
        message: "El pedido debe tener al menos un producto"
      }
    },
    total: {
      type: Number,
      required: true,
      min: 0
    }
  },
  { timestamps: true }
);

const Pedido = mongoose.model("Pedido", pedidoSchema);

module.exports = Pedido;
