const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");
const { verificarToken } = require("../middlewares/auth");

const router = express.Router();

function datosPublicosUsuario(usuario) {
  return {
    _id: usuario._id,
    nombre: usuario.nombre,
    email: usuario.email,
    rol: usuario.rol
  };
}

router.post("/registro", async (req, res) => {
  const { nombre, email, password } = req.body || {};

  if (
    typeof nombre !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    !nombre.trim() ||
    !email.trim() ||
    !password
  ) {
    return res.status(400).json({
      error: "Nombre, email y contraseña son obligatorios"
    });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const usuario = await Usuario.create({
    nombre: nombre.trim(),
    email: email.trim().toLowerCase(),
    password: passwordHash
  });

  res.status(201).json(datosPublicosUsuario(usuario));
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email.trim() ||
    !password
  ) {
    return res.status(400).json({
      error: "Email y contraseña son obligatorios"
    });
  }

  const usuario = await Usuario.findOne({ email: email.trim().toLowerCase() });

  if (!usuario) {
    return res.status(401).json({
      error: "Credenciales inválidas"
    });
  }

  const passwordValida = await bcrypt.compare(password, usuario.password);

  if (!passwordValida) {
    return res.status(401).json({
      error: "Credenciales inválidas"
    });
  }

  const token = jwt.sign(
    { id: usuario._id, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.status(200).json({
    token,
    usuario: datosPublicosUsuario(usuario)
  });
});

router.get("/perfil", verificarToken, async (req, res) => {
  const usuario = await Usuario.findById(req.usuario.id);

  if (!usuario) {
    return res.status(401).json({
      error: "Usuario no encontrado"
    });
  }

  res.status(200).json(datosPublicosUsuario(usuario));
});

module.exports = router;