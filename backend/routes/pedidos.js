const express = require("express");
const mongoose = require("mongoose");
const Pedido = require("../models/Pedido");
const Product = require("../models/Products");
const { verificarToken } = require("../middleware/auth");

const router = express.Router();

const ID_VALIDO = /^[0-9a-fA-F]{24}$/;

// Error con status para que el manejador central responda { error } con ese código.
function crearError(status, mensaje) {
  const error = new Error(mensaje);
  error.status = status;
  return error;
}

// Todas las rutas de pedidos requieren sesión.
// El usuario sale siempre del JWT (req.usuario.id), nunca del body.
router.use(verificarToken);

// POST /api/pedidos
// Body: { items: [{ id, cantidad }] }
// El precio y el total se calculan acá con los datos de la base, no con los del front.
router.post("/", async (req, res) => {
  const { items } = req.body || {};

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      error: "El carrito está vacío"
    });
  }

  // Validar cada item y sumar cantidades si el mismo producto viene repetido.
  const cantidades = new Map();

  for (const item of items) {
    const id = item?.id;
    const cantidad = item?.cantidad;

    if (typeof id !== "string" || !ID_VALIDO.test(id)) {
      return res.status(400).json({
        error: "Hay un producto con id inválido"
      });
    }

    if (!Number.isInteger(cantidad) || cantidad < 1) {
      return res.status(400).json({
        error: "Las cantidades deben ser números enteros mayores a 0"
      });
    }

    cantidades.set(id, (cantidades.get(id) || 0) + cantidad);
  }

  const ids = [...cantidades.keys()];

  // Todo en una transacción: si falta stock de algún producto o falla el guardado,
  // Mongo deshace los descuentos ya hechos y no queda ningún pedido a medias.
  // Los errores lanzados acá llegan al manejador central con su status.
  const pedido = await mongoose.connection.transaction(async (session) => {
    const productos = await Product.find({ _id: { $in: ids } }).session(session);

    if (productos.length !== ids.length) {
      throw crearError(400, "Alguno de los productos ya no existe");
    }

    for (const producto of productos) {
      const cantidad = cantidades.get(String(producto._id));

      // Descuenta solo si alcanza: la condición y el descuento van en la misma operación.
      const resultado = await Product.updateOne(
        { _id: producto._id, stock: { $gte: cantidad } },
        { $inc: { stock: -cantidad } },
        { session }
      );

      if (resultado.modifiedCount === 0) {
        throw crearError(
          400,
          `No hay stock suficiente de "${producto.nombre}" (disponibles: ${producto.stock})`
        );
      }
    }

    const itemsPedido = productos.map((producto) => ({
      producto: producto._id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: cantidades.get(String(producto._id))
    }));

    const total = itemsPedido.reduce(
      (suma, item) => suma + item.precio * item.cantidad,
      0
    );

    const [creado] = await Pedido.create(
      [{ usuario: req.usuario.id, items: itemsPedido, total }],
      { session }
    );

    return creado;
  });

  res.status(201).json(pedido);
});

// GET /api/pedidos
// Devuelve solo los pedidos del usuario autenticado, del más nuevo al más viejo.
router.get("/", async (req, res) => {
  const pedidos = await Pedido.find({ usuario: req.usuario.id })
    .sort({ createdAt: -1 });

  res.status(200).json(pedidos);
});

module.exports = router;
