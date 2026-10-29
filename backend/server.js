require("dotenv").config();

const express = require("express");
const logger = require("./middlewares/logger");
const conectarDB = require("./utils/db");
const productosRoutes = require("./routes/productos-routes");

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(logger);
app.use(express.json());

// Registrar rutas
// En /api (y no en /) porque en Vercel la raíz del sitio la sirve el frontend
app.get("/api", (req, res) => {
  res.send("Este es la API de Hermanos Jota");
});

app.use("/api/productos", productosRoutes);

// Manejar error 404
app.use((req, res, next) => {
  const error = new Error(`Ruta no encontrada: ${req.originalUrl}`);
  error.status = 404;
  next(error);
});

// Manejador errores centralizado
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({
    message: err.message || "Ha ocurrido un error en el servidor",
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack, //En desarrollo muestra el stack completo para debuguear, en desarrollo muestra el panqueque para no exponer nada
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
