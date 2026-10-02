// Punto de entrada para Vercel: expone la app de Express (backend/server.js) como función
// serverless. vercel.json redirige todas las peticiones /api/... a esta función.
module.exports = require('../backend/server');
