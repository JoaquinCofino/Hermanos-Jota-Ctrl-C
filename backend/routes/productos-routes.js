const express = require('express');
const router = express.Router();

const PRODUCTS = require('../data/productos');

// RUTAS 
// Todos los productos
router.get('/', (req, res) => {
    res.json(PRODUCTS);
});

// Buscamos por ID 
router.get("/:id", (req, res) => {
    const id = req.params.id;
    const producto = PRODUCTS.find(producto => producto.id === id);

    if (!producto) {
        return res.status(404).json({
            mensaje: "Producto no encontrado"
        });
    }

    res.json(producto);
});

module.exports = router;