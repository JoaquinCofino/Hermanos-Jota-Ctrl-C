/**
 * Catálogo de productos — Hermanos Jota
 * Array de objetos en JS puro. No hay backend: esto simula la fuente de datos
 * que en productos.html se "carga" de forma asíncrona (ver js/catalog.js).
 */
const PRODUCTS = [
  {
    id: "aparador-uspallata",
    nombre: "Aparador Uspallata",
    categoria: "Living",
    precio: 485000,
    imagen: "assets/img/productos/Aparador_Uspallata.png",
    descripcion:
      "Aparador de madera de nogal con puertas de rejilla natural y tapa de mármol. Herrajes en bronce macizo.",
    destacado: true,
  },
  {
    id: "biblioteca-recoleta",
    nombre: "Biblioteca Recoleta",
    categoria: "Living",
    precio: 620000,
    imagen: "assets/img/productos/Biblioteca_Recoleta.png",
    descripcion:
      "Estantería modular de dos cuerpos en madera maciza con detalles en bronce. Cinco niveles de guardado.",
    destacado: true,
  },
  {
    id: "butaca-mendoza",
    nombre: "Butaca Mendoza",
    categoria: "Living",
    precio: 310000,
    imagen: "assets/img/productos/Butaca_Mendoza.png",
    descripcion:
      "Butaca tapizada en terciopelo rosa polvoriento sobre estructura de madera torneada.",
    destacado: false,
  },
  {
    id: "escritorio-costa",
    nombre: "Escritorio Costa",
    categoria: "Oficina",
    precio: 540000,
    imagen: "assets/img/productos/Escritorio_Costa.png",
    descripcion:
      "Escritorio de líneas atemporales con superficie en cuero y detalles dorados. Dos cajones de guardado.",
    destacado: true,
  },
  {
    id: "mesa-comedor-pampa",
    nombre: "Mesa de Comedor Pampa",
    categoria: "Comedor",
    precio: 710000,
    imagen: "assets/img/productos/Mesa_Comedor_Pampa.png",
    descripcion:
      "Mesa de comedor en madera maciza con patas en V. Pensada para reunir a toda la familia.",
    destacado: true,
  },
  {
    id: "mesa-centro-araucaria",
    nombre: "Mesa de Centro Araucaria",
    categoria: "Living",
    precio: 265000,
    imagen: "assets/img/productos/Mesa_de_Centro_Araucaria.png",
    descripcion:
      "Mesa de centro con base escultórica de madera y tapa de vidrio templado.",
    destacado: false,
  },
  {
    id: "mesa-noche-aconcagua",
    nombre: "Mesa de Noche Aconcagua",
    categoria: "Dormitorio",
    precio: 190000,
    imagen: "assets/img/productos/Mesa_de_Noche_Aconcagua.png",
    descripcion:
      "Mesa de luz flotante en madera de nogal con cajón de cierre suave.",
    destacado: false,
  },
  {
    id: "silla-trabajo-belgrano",
    nombre: "Silla de Trabajo Belgrano",
    categoria: "Oficina",
    precio: 340000,
    imagen: "assets/img/productos/Silla_de_Trabajo_Belgrano.png",
    descripcion:
      "Silla ergonómica con estructura de madera y malla transpirable. Apoyabrazos regulables.",
    destacado: false,
  },
  {
    id: "sillas-cordoba",
    nombre: "Sillas Córdoba (Set x2)",
    categoria: "Comedor",
    precio: 220000,
    imagen: "assets/img/productos/Sillas_Cordoba.png",
    descripcion:
      "Set de dos sillas de comedor de respaldo alto, estilo windsor, con asiento tapizado.",
    destacado: false,
  },
  {
    id: "sillon-copacabana",
    nombre: "Sillón Copacabana",
    categoria: "Living",
    precio: 355000,
    imagen: "assets/img/productos/Sillon_Copacabana.png",
    descripcion:
      "Sillón de una plaza tapizado en cuero cognac sobre estructura de madera curvada.",
    destacado: false,
  },
  {
    id: "sofa-patagonia",
    nombre: "Sofá Patagonia",
    categoria: "Living",
    precio: 890000,
    imagen: "assets/img/productos/Sofa_Patagonia.png",
    descripcion:
      "Sofá de tres cuerpos tapizado en boucle verde salvia con base de madera de nogal.",
    destacado: true,
  },
];

// En un entorno de módulos (type="module") se podría usar `export`.
// Se deja también en window para que sea accesible desde scripts clásicos.
if (typeof window !== "undefined") {
  window.PRODUCTS = PRODUCTS;
}
