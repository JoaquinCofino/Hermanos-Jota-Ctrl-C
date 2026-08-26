/**
 * Renderizado del catálogo en productos.html
 */
const formateador = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

function crearTarjetaProducto(producto) {
  const a = document.createElement("a");
  a.href = `producto.html?id=${producto.id}`;
  a.className = "tarjeta-producto";
  a.innerHTML = `
    <img class="tarjeta-producto__img" src="${producto.imagen}" alt="${producto.nombre}" loading="lazy" />
    <div class="tarjeta-producto__body">
      <p class="tarjeta-producto__categoria">${producto.categoria}</p>
      <h3 class="tarjeta-producto__nombre">${producto.nombre}</h3>
      <p class="tarjeta-producto__precio">${formateador.format(producto.precio)}</p>
    </div>
  `;
  return a;
}

function renderizarProductos(lista) {
  const grilla = document.querySelector("[data-grilla-productos]");
  grilla.innerHTML = "";
  if (lista.length === 0) {
    grilla.innerHTML = `<p class="estado-carga">No se encontraron productos.</p>`;
    return;
  }
  lista.forEach((producto) => grilla.appendChild(crearTarjetaProducto(producto)));
}

async function inicializarCatalogo() {
  const grilla = document.querySelector("[data-grilla-productos]");
  const buscador = document.querySelector("[data-buscador]");
  if (!grilla) return; // esta página no tiene grilla de catálogo (ej: index.html)

  try {
    const productos = await obtenerProductos();
    renderizarProductos(productos);

    buscador.addEventListener("input", (evento) => {
      const termino = evento.target.value.trim().toLowerCase();
      const filtrados = productos.filter((p) =>
        p.nombre.toLowerCase().includes(termino) || p.categoria.toLowerCase().includes(termino)
      );
      renderizarProductos(filtrados);
    });
  } catch (error) {
    grilla.innerHTML = `<p class="estado-carga">Ocurrió un error al cargar el catálogo.</p>`;
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", inicializarCatalogo);
