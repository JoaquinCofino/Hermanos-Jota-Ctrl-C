document.addEventListener('DOMContentLoaded', async () => {
  const gridProductos = document.getElementById('gridProductos');
  const buscador = document.getElementById('buscador');

  const renderizarProductos = (lista) => {
    if (!gridProductos) return;

    if (lista.length === 0) {
      gridProductos.innerHTML = `
        <div class="sin-resultados">
          <p>No se encontraron productos que coincidan con tu búsqueda.</p>
        </div>
      `;
      return;
    }

    gridProductos.innerHTML = lista.map(producto => `
      <article class="tarjeta-producto">
        <div class="contenedor-img">
          <img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy">
        </div>
        <div class="info-producto">
          <h3>${producto.nombre}</h3>
          <p class="precio-producto">${producto.precio || ''}</p>
          <p class="medidas-producto">${producto.medidas || ''}</p>
          <p class="descripcion-corta">${producto.descripcion}</p>
          <div class="pie-tarjeta">
            <span class="etiqueta-material">${producto.etiqueta || ''}</span>
            <a href="producto.html?id=${producto.id}" class="btn-ver-detalle">Ver Detalle</a>
          </div>
        </div>
      </article>
    `).join('');
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
        (prod.materiales && prod.materiales.toLowerCase().includes(termino)) ||
        (prod.etiqueta && prod.etiqueta.toLowerCase().includes(termino))
      );
      renderizarProductos(filtrados);
    });
  }
});