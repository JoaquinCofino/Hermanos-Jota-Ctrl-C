/**
 * Renderizado de carrito.html a partir del array simulado en localStorage.
 * Agrupa por producto (cada id repetido = una unidad) y muestra cantidad,
 * subtotal y total. Usa las mismas funciones de main.js (leerCarrito, etc).
 */
const formateadorARS = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

function agruparCarrito(idsCarrito, productos) {
  const cantidades = {};
  idsCarrito.forEach((id) => {
    cantidades[id] = (cantidades[id] || 0) + 1;
  });

  return Object.keys(cantidades)
    .map((id) => {
      const producto = productos.find((p) => p.id === id);
      if (!producto) return null;
      return { producto, cantidad: cantidades[id] };
    })
    .filter(Boolean);
}

function crearFilaCarrito({ producto, cantidad }) {
  const fila = document.createElement("article");
  fila.className = "fila-carrito";
  const subtotal = producto.precio * cantidad;

  fila.innerHTML = `
    <img class="fila-carrito__img" src="${producto.imagen}" alt="${producto.nombre}" />
    <div class="fila-carrito__info">
      <h3>${producto.nombre}</h3>
      <p class="categoria">${formateadorARS.format(producto.precio)} c/u</p>
    </div>
    <div class="fila-carrito__cantidad">
      <button type="button" data-restar aria-label="Quitar una unidad">−</button>
      <span>${cantidad}</span>
      <button type="button" data-sumar aria-label="Agregar una unidad">+</button>
    </div>
    <p class="fila-carrito__subtotal">${formateadorARS.format(subtotal)}</p>
    <button type="button" class="fila-carrito__quitar" data-quitar aria-label="Quitar producto">✕</button>
  `;

  fila.querySelector("[data-sumar]").addEventListener("click", () => {
    agregarAlCarrito(producto.id);
    renderizarCarrito();
  });
  fila.querySelector("[data-restar]").addEventListener("click", () => {
    quitarUnidadDelCarrito(producto.id);
    renderizarCarrito();
  });
  fila.querySelector("[data-quitar]").addEventListener("click", () => {
    quitarProductoDelCarrito(producto.id);
    renderizarCarrito();
  });

  return fila;
}

async function renderizarCarrito() {
  const contenedor = document.querySelector("[data-carrito-lista]");
  const totalEl = document.querySelector("[data-carrito-total]");
  const vaciarBtn = document.querySelector("[data-vaciar-carrito]");

  try {
    const productos = await obtenerProductos();
    const idsCarrito = leerCarrito();
    const items = agruparCarrito(idsCarrito, productos);

    contenedor.innerHTML = "";

    if (items.length === 0) {
      contenedor.innerHTML = `
        <p class="estado-carga">
          Tu carrito está vacío. <a href="productos.html">Ver catálogo →</a>
        </p>`;
      totalEl.textContent = formateadorARS.format(0);
      if (vaciarBtn) vaciarBtn.hidden = true;
      return;
    }

    if (vaciarBtn) vaciarBtn.hidden = false;
    items.forEach((item) => contenedor.appendChild(crearFilaCarrito(item)));

    const total = items.reduce((acc, { producto, cantidad }) => acc + producto.precio * cantidad, 0);
    totalEl.textContent = formateadorARS.format(total);
  } catch (error) {
    contenedor.innerHTML = `<p class="estado-carga">Ocurrió un error al cargar el carrito.</p>`;
    console.error(error);
  }
}

function inicializarCarrito() {
  const vaciarBtn = document.querySelector("[data-vaciar-carrito]");
  if (vaciarBtn) {
    vaciarBtn.addEventListener("click", () => {
      vaciarCarrito();
      renderizarCarrito();
    });
  }
  renderizarCarrito();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", inicializarCarrito);
} else {
  inicializarCarrito();
}