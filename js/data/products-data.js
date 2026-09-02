/**
 * Catálogo de productos — Hermanos Jota
 * Array de objetos en JS puro. No hay backend: esto simula la fuente de datos
 * que en productos.html se "carga" de forma asíncrona (ver js/catalog.js).
 *
 * "fabricacion" es una lista ordenada de pares { label, value } — cada producto
 * tiene sus propios atributos (no todos comparten el mismo esquema), así que se
 * renderiza dinámicamente en producto.html en vez de usar campos fijos.
 */
const PRODUCTS = [
  {
    id: "aparador-uspallata",
    nombre: "Aparador Uspallata",
    categoria: "Living",
    precio: 485000,
    imagen: "assets/img/productos/Aparador_Uspallata.png",
    descripcion:
      "Aparador de seis puertas fabricado en nogal sostenible con tiradores metálicos en acabado latón. Su silueta minimalista realza el veteado natural de la madera, creando una pieza que combina funcionalidad y elegancia atemporal para espacios contemporáneos.",
    destacado: true,
    fabricacion: [
      { label: "Medidas", value: "180 × 45 × 75 cm" },
      { label: "Materiales", value: "Nogal macizo FSC®, herrajes de latón" },
      { label: "Acabado", value: "Aceite natural ecológico" },
      { label: "Peso", value: "68 kg" },
      { label: "Capacidad", value: "6 compartimentos interiores" },
    ],
  },
  {
    id: "biblioteca-recoleta",
    nombre: "Biblioteca Recoleta",
    categoria: "Living",
    precio: 620000,
    imagen: "assets/img/productos/Biblioteca_Recoleta.png",
    descripcion:
      "Sistema modular de estantes abierto que combina estructura de acero Sage Green y repisas en roble claro. Perfecta para colecciones y objetos de diseño, su diseño versátil se adapta a cualquier espacio contemporáneo con elegancia funcional.",
    destacado: true,
    fabricacion: [
      { label: "Medidas", value: "100 × 35 × 200 cm" },
      { label: "Materiales", value: "Estructura de acero, estantes de roble" },
      { label: "Acabado", value: "Laca mate ecológica" },
      { label: "Capacidad", value: "45 kg por estante" },
      { label: "Modulares", value: "5 estantes ajustables" },
    ],
  },
  {
    id: "butaca-mendoza",
    nombre: "Butaca Mendoza",
    categoria: "Living",
    precio: 310000,
    imagen: "assets/img/productos/Butaca_Mendoza.png",
    descripcion:
      "Butaca tapizada en bouclé Dusty Rose con base de madera de guatambú. El respaldo curvo abraza el cuerpo y ofrece máximo confort, mientras que su diseño orgánico aporta calidez y sofisticación a cualquier ambiente contemporáneo.",
    destacado: false,
    fabricacion: [
      { label: "Medidas", value: "80 × 75 × 85 cm" },
      { label: "Materiales", value: "Guatambú macizo, tela bouclé" },
      { label: "Acabado", value: "Cera vegetal, tapizado premium" },
      { label: "Tapizado", value: "Repelente al agua y manchas" },
      { label: "Confort", value: "Espuma alta densidad" },
    ],
  },
  {
    id: "escritorio-costa",
    nombre: "Escritorio Costa",
    categoria: "Oficina",
    precio: 540000,
    imagen: "assets/img/productos/Escritorio_Costa.png",
    descripcion:
      "Escritorio compacto con cajón organizado y tapa pasacables integrada en bambú laminado. Ideal para espacios de trabajo en casa, combina funcionalidad moderna con estética minimalista y sostenible, perfecto para el trabajo remoto.",
    destacado: true,
    fabricacion: [
      { label: "Medidas", value: "120 × 60 × 75 cm" },
      { label: "Materiales", value: "Bambú laminado, herrajes ocultos" },
      { label: "Acabado", value: "Laca mate resistente" },
      { label: "Almacenamiento", value: "1 cajón con organizador" },
      { label: "Cables", value: "Pasacables integrado" },
    ],
  },
  {
    id: "mesa-comedor-pampa",
    nombre: "Mesa de Comedor Pampa",
    categoria: "Comedor",
    precio: 710000,
    imagen: "assets/img/productos/Mesa_Comedor_Pampa.png",
    descripcion:
      "Mesa extensible de roble macizo con tablero biselado y sistema de apertura suave. Su diseño robusto y elegante se adapta perfectamente a reuniones íntimas o grandes celebraciones familiares, extendiéndose de 6 a 10 comensales.",
    destacado: true,
    fabricacion: [
      { label: "Medidas", value: "160-240 × 90 × 75 cm" },
      { label: "Materiales", value: "Roble macizo FSC®, mecanismo alemán" },
      { label: "Acabado", value: "Aceite-cera natural" },
      { label: "Capacidad", value: "6-10 comensales" },
    ],
  },
  {
    id: "mesa-centro-araucaria",
    nombre: "Mesa de Centro Araucaria",
    categoria: "Living",
    precio: 265000,
    imagen: "assets/img/productos/Mesa_de_Centro_Araucaria.png",
    descripcion:
      "Mesa de centro con sobre circular de mármol Patagonia y base de tres patas en madera de nogal. Su diseño minimalista se convierte en el punto focal perfecto para cualquier sala de estar contemporánea, combinando la frialdad del mármol con la calidez de la madera.",
    destacado: false,
    fabricacion: [
      { label: "Medidas", value: "90 × 90 × 45 cm" },
      { label: "Materiales", value: "Sobre de mármol Patagonia, patas de nogal" },
      { label: "Acabado", value: "Mármol pulido, aceite natural en madera" },
      { label: "Peso", value: "42 kg" },
      { label: "Carga máxima", value: "25 kg distribuidos" },
    ],
  },
  {
    id: "mesa-noche-aconcagua",
    nombre: "Mesa de Noche Aconcagua",
    categoria: "Dormitorio",
    precio: 190000,
    imagen: "assets/img/productos/Mesa_de_Noche_Aconcagua.png",
    descripcion:
      "Mesa de noche con cajón oculto y repisa inferior en roble certificado FSC®. Su diseño limpio y funcional permite convivir con diferentes estilos de dormitorio, ofreciendo almacenamiento discreto y elegante para objetos personales.",
    destacado: false,
    fabricacion: [
      { label: "Medidas", value: "45 × 35 × 60 cm" },
      { label: "Materiales", value: "Roble macizo FSC®, herrajes soft-close" },
      { label: "Acabado", value: "Barniz mate de poliuretano" },
      { label: "Almacenamiento", value: "1 cajón + repisa inferior" },
    ],
  },
  {
    id: "silla-trabajo-belgrano",
    nombre: "Silla de Trabajo Belgrano",
    categoria: "Oficina",
    precio: 340000,
    imagen: "assets/img/productos/Silla_de_Trabajo_Belgrano.png",
    descripcion:
      "Silla ergonómica regulable en altura con respaldo de malla transpirable y asiento tapizado en tejido reciclado. Diseñada para largas jornadas de trabajo con máximo confort y apoyo lumbar, ideal para oficinas en casa y espacios de coworking.",
    destacado: false,
    fabricacion: [
      { label: "Medidas", value: "60 × 60 × 90-100 cm" },
      { label: "Materiales", value: "Malla técnica, tejido reciclado" },
      { label: "Acabado", value: "Base cromada, tapizado premium" },
      { label: "Regulación", value: "Altura + inclinación respaldo" },
      { label: "Certificación", value: "Ergonomía europea EN 1335" },
    ],
  },
  {
    id: "sillas-cordoba",
    nombre: "Sillas Córdoba",
    categoria: "Comedor",
    precio: 220000,
    imagen: "assets/img/productos/Sillas_Cordoba.png",
    descripcion:
      "Set de cuatro sillas apilables en contrachapado moldeado de nogal y estructura tubular pintada en Sage Green. Su diseño ergonómico y materiales de calidad garantizan comodidad y durabilidad en el uso diario, perfectas para comedores contemporáneos.",
    destacado: false,
    fabricacion: [
      { label: "Medidas", value: "45 × 52 × 80 cm (cada una)" },
      { label: "Materiales", value: "Contrachapado nogal, tubo de acero" },
      { label: "Acabado", value: "Laca mate, pintura epoxi" },
      { label: "Apilables", value: "Hasta 6 sillas" },
      { label: "Incluye", value: "Set de 4 sillas" },
    ],
  },
  {
    id: "sillon-copacabana",
    nombre: "Sillón Copacabana",
    categoria: "Living",
    precio: 355000,
    imagen: "assets/img/productos/Sillon_Copacabana.png",
    descripcion:
      "Sillón lounge en cuero cognac con base giratoria en acero Burnt Sienna. Inspirado en la estética brasilera moderna de los 60, combina comodidad excepcional con un diseño icónico que trasciende tendencias y épocas.",
    destacado: false,
    fabricacion: [
      { label: "Medidas", value: "90 × 85 × 95 cm" },
      { label: "Materiales", value: "Cuero curtido vegetal, acero pintado" },
      { label: "Acabado", value: "Cuero anilina premium" },
      { label: "Rotación", value: "360° silenciosa y suave" },
      { label: "Garantía", value: "10 años en estructura" },
    ],
  },
  {
    id: "sofa-patagonia",
    nombre: "Sofá Patagonia",
    categoria: "Living",
    precio: 890000,
    imagen: "assets/img/productos/Sofa_Patagonia.png",
    descripcion:
      "Sofá de tres cuerpos tapizado en lino Warm Alabaster con patas cónicas de madera. Los cojines combinan espuma de alta resiliencia con plumón reciclado, ofreciendo comodidad duradera y sostenible para el hogar moderno.",
    destacado: true,
    fabricacion: [
      { label: "Medidas", value: "220 × 90 × 80 cm" },
      { label: "Estructura", value: "Madera de eucalipto certificada FSC®" },
      { label: "Tapizado", value: "Lino 100% natural premium" },
      { label: "Relleno", value: "Espuma HR + plumón reciclado" },
      { label: "Sostenibilidad", value: "Materiales 100% reciclables" },
    ],
  },
];

// En un entorno de módulos (type="module") se podría usar `export`.
// Se deja también en window para que sea accesible desde scripts clásicos.
if (typeof window !== "undefined") {
  window.PRODUCTS = PRODUCTS;
}