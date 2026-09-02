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
    const f = producto.fabricacion;
    const fabricacionHTML =
      f && f.length
        ? `
      <section class="detalle-fabricacion">
        <h2>Detalles de fabricación</h2>
        <dl>
          ${f.map((item) => `<dt>${item.label}</dt><dd>${item.value}</dd>`).join("")}
        </dl>
      </section>`
    : "";

    contenedor.innerHTML = `
      <img class="detalle-producto__img" src="${producto.imagen}" alt="${producto.nombre}" />
      <div class="detalle-producto__info">
        <p class="tarjeta-producto__categoria">${producto.categoria}</p>
        <h1>${producto.nombre}</h1>
        <div class="detalle-producto__compra">
          <p class="detalle-producto__precio">${new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            maximumFractionDigits: 0,
          }).format(producto.precio)}</p>
          <button type="button" data-boton-agregar>Añadir al carrito</button>
        </div>
        <p class="mensaje-exito" data-mensaje-exito hidden>Se agregó al carrito ✓</p>
        <p class="detalle-producto__descripcion">${producto.descripcion}</p>
      </div>
      ${fabricacionHTML}
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
