/**
 * Renderizado de producto.html a partir del ?id= en la URL
 */
async function inicializarDetalle() {
  const contenedor = document.querySelector("[data-detalle-producto]");
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    contenedor.innerHTML = `<p class="estado-carga">Producto no especificado.</p>`;
    return;
  }

  try {
    const producto = await obtenerProductoPorId(id);
    if (!producto) {
      contenedor.innerHTML = `<p class="estado-carga">Producto no encontrado.</p>`;
      return;
    }

    document.title = `${producto.nombre} — Hermanos Jota`;
    contenedor.innerHTML = `
      <img class="detalle-producto__img" src="${producto.imagen}" alt="${producto.nombre}" />
      <div class="detalle-producto__info">
        <p class="tarjeta-producto__categoria">${producto.categoria}</p>
        <h1>${producto.nombre}</h1>
        <p class="detalle-producto__precio">${new Intl.NumberFormat("es-AR", {
          style: "currency",
          currency: "ARS",
          maximumFractionDigits: 0,
        }).format(producto.precio)}</p>
        <p>${producto.descripcion}</p>
        <button type="button" data-boton-agregar>Añadir al carrito</button>
        <p class="mensaje-exito" data-mensaje-exito hidden>Se agregó al carrito ✓</p>
      </div>
    `;

    const boton = contenedor.querySelector("[data-boton-agregar]");
    const mensaje = contenedor.querySelector("[data-mensaje-exito]");
    boton.addEventListener("click", () => {
      agregarAlCarrito(producto.id);
      mensaje.hidden = false;
    });
  } catch (error) {
    contenedor.innerHTML = `<p class="estado-carga">Ocurrió un error al cargar el producto.</p>`;
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", inicializarDetalle);
