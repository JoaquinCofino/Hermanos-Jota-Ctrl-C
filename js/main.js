/**
 * Lógica común a todas las páginas: carrito simulado en localStorage
 * y actualización del contador en el header.
 */
const CARRITO_KEY = "hj_carrito";

function leerCarrito() {
  try {
    return JSON.parse(localStorage.getItem(CARRITO_KEY)) || [];
  } catch {
    return [];
  }
}

function guardarCarrito(carrito) {
  localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
  actualizarContadorCarrito();
}

function agregarAlCarrito(idProducto) {
  const carrito = leerCarrito();
  carrito.push(idProducto);
  guardarCarrito(carrito);
}

function actualizarContadorCarrito() {
  const contador = document.querySelector("[data-carrito-contador]");
  if (contador) {
    contador.textContent = leerCarrito().length;
  }
}

function inicializarMenuMovil() {
  const boton = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector(".site-nav");
  if (!boton || !nav) return;

  boton.addEventListener("click", () => {
    const abierto = nav.classList.toggle("abierto");
    boton.setAttribute("aria-expanded", abierto ? "true" : "false");
  });
}

document.addEventListener("DOMContentLoaded", actualizarContadorCarrito);
document.addEventListener("DOMContentLoaded", inicializarMenuMovil);
