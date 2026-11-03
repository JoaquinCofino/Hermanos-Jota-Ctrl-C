const Product = require("../models/Products");
const Categoria = require("../models/Categoria");

async function buscarCategoriaPorId(id) {
  return Categoria.findById(id);
}

// GET /api/productos
exports.getProducts = async (req, res) => {
  const filtro = {};

  if (req.query.categoria !== undefined) {
    const categoria = await buscarCategoriaPorId(req.query.categoria);

    if (!categoria) {
      return res.status(200).json([]);
    }

    filtro.categoria = categoria._id;
  }

  const productos = await Product.find(filtro)
    .populate("categoria", "nombre");

  res.status(200).json(productos);
};

// GET /api/productos/:id
exports.getProductById = async (req, res) => {
  const producto = await Product.findById(req.params.id)
    .populate("categoria", "nombre");

  if (!producto) {
    return res.status(404).json({
      error: "Producto no encontrado"
    });
  }

  res.status(200).json(producto);
};

// POST /api/productos
exports.createProduct = async (req, res) => {
  const { categoria, ...datosProducto } = req.body || {};

  if (categoria !== undefined) {
    const categoriaEncontrada = await buscarCategoriaPorId(categoria);

    if (!categoriaEncontrada) {
      return res.status(400).json({
        error: "La categoría no existe"
      });
    }

    datosProducto.categoria = categoriaEncontrada._id;
  }

  const producto = await Product.create(datosProducto);
  await producto.populate("categoria", "nombre");

  res.status(201).json(producto);
};

// PUT /api/productos/:id
exports.updateProduct = async (req, res) => {
  const datosActualizados = { ...(req.body || {}) };

  if (datosActualizados.categoria !== undefined) {
    const categoriaEncontrada = await buscarCategoriaPorId(
      datosActualizados.categoria
    );

    if (!categoriaEncontrada) {
      return res.status(400).json({
        error: "La categoría no existe"
      });
    }

    datosActualizados.categoria = categoriaEncontrada._id;
  }

  const producto = await Product.findByIdAndUpdate(
    req.params.id,
    datosActualizados,
    {
      returnDocument: "after",
      runValidators: true
    }
  ).populate("categoria", "nombre");

  if (!producto) {
    return res.status(404).json({
      error: "Producto no encontrado"
    });
  }

  res.status(200).json(producto);
};

// DELETE /api/productos/:id
exports.deleteProduct = async (req, res) => {
  const producto = await Product.findByIdAndDelete(req.params.id);

  if (!producto) {
    return res.status(404).json({
      error: "Producto no encontrado"
    });
  }

  res.status(200).json({
    mensaje: "Producto eliminado correctamente"
  });
};