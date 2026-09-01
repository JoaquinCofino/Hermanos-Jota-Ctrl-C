const PRODUCTOS = [
  {
    id: "aparador-uspallata",
    nombre: "Aparador Uspallata",
    medidas: "180 × 45 × 75 cm",
    materiales: "Nogal macizo FSC®, herrajes de latón",
    descripcion: "Aparador de seis puertas fabricado en nogal sostenible con tiradores metálicos en acabado latón.",
    imagen: "assets/img/productos/Aparador_Uspallata.png",
    etiqueta: "Nogal Macizo FSC®"
  },
  {
    id: "biblioteca-recoleta",
    nombre: "Biblioteca Recoleta",
    medidas: "100 × 35 × 200 cm",
    materiales: "Estructura de acero, estantes de roble",
    descripcion: "Sistema modular de estantes abierto que combina estructura de acero Sage Green y repisas en roble claro.",
    imagen: "assets/img/productos/Biblioteca_Recoleta.png",
    etiqueta: "Roble y Acero"
  },
  {
    id: "butaca-mendoza",
    nombre: "Butaca Mendoza",
    medidas: "80 × 75 × 85 cm",
    materiales: "Guatambú macizo, tela bouclé",
    descripcion: "Butaca tapizada en bouclé Dusty Rose con base curva en madera noble de guatambú.",
    imagen: "assets/img/productos/Butaca_Mendoza.png",
    etiqueta: "Guatambú Macizo"
  },
  {
    id: "sillon-copacabana",
    nombre: "Sillón Copacabana",
    medidas: "90 × 85 × 95 cm",
    materiales: "Cuero curtido vegetal, acero pintado",
    descripcion: "Sillón lounge en cuero cognac con base giratoria en acero Burnt Sienna. Inspirado en la estética brasilera moderna de los 60.",
    imagen: "assets/img/productos/Sillon_Copacabana.png",
    etiqueta: "Cuero Curtido Vegetal"
  },
  {
    id: "mesa-araucaria",
    nombre: "Mesa de Centro Araucaria",
    medidas: "90 × 90 × 45 cm",
    materiales: "Sobre de mármol Patagonia, patas de nogal",
    descripcion: "Mesa de centro con sobre circular de mármol Patagonia y base de tres patas en madera de nogal.",
    imagen: "assets/img/productos/Mesa_de_Centro_Araucaria.png",
    etiqueta: "Mármol y Nogal"
  },
  {
    id: "mesa-aconcagua",
    nombre: "Mesa de Noche Aconcagua",
    medidas: "45 × 35 × 60 cm",
    materiales: "Roble macizo FSC®, herrajes soft-close",
    descripcion: "Mesa de noche con cajón oculto y repisa inferior en roble certificado FSC®.",
    imagen: "assets/img/productos/Mesa_de_Noche_Aconcagua.png",
    etiqueta: "Roble Macizo FSC®"
  },
  {
    id: "sofa-patagonia",
    nombre: "Sofá Patagonia",
    medidas: "220 × 90 × 80 cm",
    materiales: "Madera de eucalipto certificada FSC®, lino natural",
    descripcion: "Sofá de tres cuerpos tapizado en lino Warm Alabaster con patas cónicas de madera y plumón reciclado.",
    imagen: "assets/img/productos/Sofa_Patagonia.png",
    etiqueta: "Lino 100% Natural"
  },
  {
    id: "mesa-pampa",
    nombre: "Mesa Comedor Pampa",
    medidas: "160-240 × 90 × 75 cm",
    materiales: "Roble macizo FSC®, mecanismo alemán",
    descripcion: "Mesa extensible de roble macizo con tablero biselado y sistema de mariposa central para 6 a 10 comensales.",
    imagen: "assets/img/productos/Mesa_Comedor_Pampa.png",
    etiqueta: "Roble Macizo Extensible"
  },
  {
    id: "sillas-cordoba",
    nombre: "Sillas Córdoba",
    medidas: "45 × 52 × 80 cm (c/u)",
    materiales: "Contrachapado nogal, tubo de acero",
    descripcion: "Set de cuatro sillas apilables en contrachapado moldeado de nogal y estructura tubular en Sage Green.",
    imagen: "assets/img/productos/Sillas_Cordoba.png",
    etiqueta: "Set de 4 Sillas"
  },
  {
    id: "escritorio-costa",
    nombre: "Escritorio Costa",
    medidas: "120 × 60 × 75 cm",
    materiales: "Bambú laminado, herrajes ocultos",
    descripcion: "Escritorio compacto con cajón organizado y tapa pasacables integrada en bambú laminado.",
    imagen: "assets/img/productos/Escritorio_Costa.png",
    etiqueta: "Bambú Sostenible"
  },
  {
    id: "silla-belgrano",
    nombre: "Silla de Trabajo Belgrano",
    medidas: "60 × 60 × 90-100 cm",
    materiales: "Malla técnica, tejido reciclado",
    descripcion: "Silla ergonómica regulable en altura con respaldo de malla transpirable y certificación europea EN 1335.",
    imagen: "assets/img/productos/Silla_de_Trabajo_Belgrano.png",
    etiqueta: "Ergonomía Certificada"
  }
];

document.addEventListener('DOMContentLoaded', () => {
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
          <p class="medidas-producto">${producto.medidas}</p>
          <p class="descripcion-corta">${producto.descripcion}</p>
          <div class="pie-tarjeta">
            <span class="etiqueta-material">${producto.etiqueta}</span>
            <a href="producto.html?id=${producto.id}" class="btn-ver-detalle">Ver Detalle</a>
          </div>
        </div>
      </article>
    `).join('');
  };

  // Simulación de carga asíncrona (300ms)
  setTimeout(() => {
    renderizarProductos(PRODUCTOS);
  }, 300);

  // Buscador en tiempo real
  if (buscador) {
    buscador.addEventListener('input', (e) => {
      const termino = e.target.value.toLowerCase().trim();
      const filtrados = PRODUCTOS.filter(prod =>
        prod.nombre.toLowerCase().includes(termino) ||
        prod.descripcion.toLowerCase().includes(termino) ||
        prod.materiales.toLowerCase().includes(termino) ||
        prod.etiqueta.toLowerCase().includes(termino)
      );
      renderizarProductos(filtrados);
    });
  }
});