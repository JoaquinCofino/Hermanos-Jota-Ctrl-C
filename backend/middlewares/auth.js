const jwt = require("jsonwebtoken");

function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Token no proporcionado o formato inválido"
    });
  }

  const token = authHeader.slice(7).trim();

  if (!token) {
    return res.status(401).json({
      error: "Token no proporcionado"
    });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload;
    next();
  } catch {
    return res.status(401).json({
      error: "Token inválido o expirado"
    });
  }
}

function soloAdmin(req, res, next) {
  if (req.usuario?.rol === "admin") {
    return next();
  }

  return res.status(403).json({
    error: "No tenés permiso para realizar esta acción"
  });
}

module.exports = { verificarToken, soloAdmin };
