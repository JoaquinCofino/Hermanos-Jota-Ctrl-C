const Product = require("../models/Products");

// GET /api/productos
exports.getProducts = async (req, res) => {
  try {
    const productos = await Product.find();
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// GET /api/productos/:id
exports.getProductById = async (req, res) => {
  try {
    const producto = await Product.findById(req.params.id);

    if (!producto) {
      return res.status(404).json({
        mensaje: "Producto no encontrado"
      });
    }

    res.status(200).json(producto);
  } catch (error) {
    res.status(400).json({ mensaje: "ID inválido" });
  }
};

// POST /api/productos
exports.createProduct = async (req, res) => {
  try {
    const producto = await Product.create(req.body);
    res.status(201).json(producto);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
};

// PUT /api/productos/:id
exports.updateProduct = async (req, res) => {
  try {
    if (req.body.precio && req.body.precio < 0) {
      return res.status(400).json({
        mensaje: "El precio no puede ser negativo"
      });
    }
    const producto = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        returnDocument: 'after',
        runValidators: true
      }
    );

    if (!producto) {
      return res.status(404).json({
        mensaje: "Producto no encontrado"
      });
    }

    res.status(200).json(producto);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
};

// DELETE /api/productos/:id
exports.deleteProduct = async (req, res) => {
  try {
    const producto = await Product.findByIdAndDelete(
      req.params.id
    );

    if (!producto) {
      return res.status(404).json({
        mensaje: "Producto no encontrado"
      });
    }

    res.status(200).json({
      mensaje: "Producto eliminado correctamente"
    });
  } catch (error) {
    res.status(400).json({ mensaje: "ID inválido" });
  }
};