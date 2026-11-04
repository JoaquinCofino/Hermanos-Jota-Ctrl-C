require("dotenv").config();

const express = require("express");
const cors = require("cors");
const logger = require("./middlewares/logger");
const conectarDB = require("./utils/db");
const productosRoutes = require("./routes/productos-routes");
const categoriasRoutes = require("./routes/categorias");

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(logger);
app.use(express.json());

// Registrar rutas
// En /api (y no en /) porque en Vercel la raíz del sitio la sirve el frontend
app.get("/api", (req, res) => {
  res.send("Este es la API de Hermanos Jota");
});

app.use("/api/productos", productosRoutes);
app.use("/api/categorias", categoriasRoutes);

// Manejar error 404
app.use((req, res, next) => {
  const error = new Error(`Ruta no encontrada: ${req.originalUrl}`);
  error.status = 404;
  next(error);
});

// Manejador errores centralizado
app.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    const mensaje = Object.values(err.errors).map((e) => e.message).join(", ");
    return res.status(400).json({ error: mensaje || "Datos inválidos" });
  }

  if (err.name === "CastError") {
    return res.status(400).json({ error: "Id mal formado" });
  }

  if (err.code === 11000) {
    return res.status(409).json({ error: "Ya existe un registro con ese valor" });
  }

  const statusCode = err.status || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({
    error: err.message || "Ha ocurrido un error en el servidor"
  });
});

async function startServer() {
  try {
    await conectarDB();

    app.listen(PORT, () => {
      console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error.message);
    process.exit(1);
  }
}

// Con "npm start" / "npm run dev" se levanta el servidor normalmente.
// En Vercel no se llama a listen: el servicio "backend" (vercel.json) ejecuta la app exportada.
if (require.main === module) {
  startServer();
}

module.exports = app;
