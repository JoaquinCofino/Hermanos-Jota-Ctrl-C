/**
 * Renderizado de los 3-4 productos destacados en index.html
 */
async function inicializarDestacados() {
  const contenedor = document.querySelector("[data-destacados]");
  try {
    const productos = await obtenerProductos();
    const destacados = productos.filter((p) => p.destacado).slice(0, 4);
    contenedor.innerHTML = "";
    destacados.forEach((producto) => contenedor.appendChild(crearTarjetaProducto(producto)));
  } catch (error) {
    contenedor.innerHTML = `<p class="estado-carga">No se pudieron cargar los destacados.</p>`;
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", inicializarDestacados);
