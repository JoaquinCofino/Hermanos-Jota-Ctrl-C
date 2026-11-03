const express = require("express");
const router = express.Router();
const Categoria = require("../models/Categoria");

router.get("/", async (req, res) => {
  const categorias = await Categoria.find().sort({ nombre: 1 });
  res.status(200).json(categorias);
});

router.post("/", async (req, res) => {
  const categoria = await Categoria.create(req.body || {});
  res.status(201).json(categoria);
});

module.exports = router;
