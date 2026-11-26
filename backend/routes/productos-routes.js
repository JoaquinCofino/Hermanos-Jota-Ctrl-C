const express = require("express");
const router = express.Router();

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require("../controller/productsController");
const { verificarToken, soloAdmin } = require("../middlewares/auth");

// Obtener todos los productos
router.get("/", getProducts);

// Obtener un producto por ID
router.get("/:id", getProductById);

// Crear un producto
router.post("/", verificarToken, soloAdmin, createProduct);

// Actualizar un producto
router.put("/:id", verificarToken, soloAdmin, updateProduct);

// Eliminar un producto
router.delete("/:id", verificarToken, soloAdmin, deleteProduct);

module.exports = router;