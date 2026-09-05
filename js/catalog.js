const formateadorMoneda = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0
});

// Función global requerida por home.js (para los 4 destacados) y catalog.js
function crearTarjetaProducto(producto) {
  const precioFormateado = typeof producto.precio === 'number'
    ? formateadorMoneda.format(producto.precio)
    : (producto.precio || '');

  const tarjeta = document.createElement('a');
  tarjeta.href = `producto.html?id=${producto.id}`;
  tarjeta.className = 'tarjeta-producto';

  tarjeta.innerHTML = `
    <img 
      src="${producto.imagen}" 
      alt="${producto.nombre}" 
      class="tarjeta-producto__img" 
      loading="lazy"
    >
    <div class="tarjeta-producto__body">
      <span class="tarjeta-producto__categoria">${producto.categoria || ''}</span>
      <h3 class="tarjeta-producto__nombre">${producto.nombre}</h3>
      <p class="tarjeta-producto__precio">${precioFormateado}</p>
    </div>
  `;

  return tarjeta;
}

document.addEventListener('DOMContentLoaded', async () => {
  const gridProductos = document.getElementById('gridProductos');
  const buscador = document.getElementById('buscador');

  const renderizarProductos = (lista) => {
    if (!gridProductos) return;

    gridProductos.innerHTML = '';

    if (lista.length === 0) {
      gridProductos.innerHTML = `
        <div class="sin-resultados">
          <p>No se encontraron productos que coincidan con tu búsqueda.</p>
        </div>
      `;
      return;
    }

    lista.forEach(prod => {
      gridProductos.appendChild(crearTarjetaProducto(prod));
    });
  };

  let productosDisponibles = [];
  try {
    if (typeof obtenerProductos === 'function') {
      productosDisponibles = await obtenerProductos();
    } else {
      productosDisponibles = typeof PRODUCTS !== 'undefined' ? PRODUCTS : [];
    }
    renderizarProductos(productosDisponibles);
  } catch (error) {
    gridProductos.innerHTML = '<div class="estado-carga">Error al cargar los productos.</div>';
  }

  if (buscador) {
    buscador.addEventListener('input', (e) => {
      const termino = e.target.value.toLowerCase().trim();
      const filtrados = productosDisponibles.filter(prod =>
        prod.nombre.toLowerCase().includes(termino) ||
        prod.descripcion.toLowerCase().includes(termino) ||
        (prod.categoria && prod.categoria.toLowerCase().includes(termino)) ||
        (prod.materiales && prod.materiales.toLowerCase().includes(termino)) ||
        (prod.etiqueta && prod.etiqueta.toLowerCase().includes(termino))
      );
      renderizarProductos(filtrados);
    });
  }
});