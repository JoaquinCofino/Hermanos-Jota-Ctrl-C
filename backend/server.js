const express = require('express');
const logger = require('./middlewares/logger');

const app = express();

const PORT = process.env.PORT || 4000;

const productosRoutes = require('./routes/productos-routes');

app.use(logger);
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Este es la API de Hermanos Jota');
});

app.use("/api/productos", productosRoutes);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`);
});