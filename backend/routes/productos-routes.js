const express = require("express");
const router = express.Router();

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require("../controller/productsController");

// Obtener todos los productos
router.get("/", getProducts);

// Obtener un producto por ID
router.get("/:id", getProductById);

// Crear un producto
router.post("/", createProduct);

// Actualizar un producto
router.put("/:id", updateProduct);

// Eliminar un producto
router.delete("/:id", deleteProduct);

module.exports = router;