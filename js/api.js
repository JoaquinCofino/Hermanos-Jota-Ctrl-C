/**
 * "API" local — simula una petición asíncrona de datos sin backend real.
 * Cumple el requisito de la consigna: carga asíncrona con setTimeout / async-await.
 */

/**
 * Simula el fetch del catálogo completo.
 * @param {number} demoraMs
 * @returns {Promise<Array<object>>}
 */
function obtenerProductos(demoraMs = 500) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (typeof PRODUCTS === "undefined") {
        reject(new Error("No se pudo cargar el catálogo (products-data.js no está cargado)."));
        return;
      }
      resolve(PRODUCTS);
    }, demoraMs);
  });
}

/**
 * Simula el fetch de un único producto por id.
 * @param {string} id
 * @returns {Promise<object|undefined>}
 */
async function obtenerProductoPorId(id) {
  const productos = await obtenerProductos(300);
  return productos.find((p) => p.id === id);
}
