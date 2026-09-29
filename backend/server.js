const express = require('express');

const app = express();

const PORT = 4000;

app.get('/', (req, res) => {
    res.send('¡Bienvenido al API de Mueblería Jota!');
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo exitosamente en http://localhost:${PORT}`);
});