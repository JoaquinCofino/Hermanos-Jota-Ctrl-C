const PRODUCTS = [
  {
    id: "aparador-uspallata",
    nombre: "Aparador Uspallata",
    precio: 185000,
    categoria: "Almacenamiento",
    destacado: true,
    medidas: "180 × 45 × 75 cm",
    materiales: "Nogal macizo FSC®, herrajes de latón",
    descripcion: "Aparador de seis puertas fabricado en nogal sostenible con tiradores metálicos en acabado latón.",
    imagen: "assets/img/productos/Aparador_Uspallata.png",
    etiqueta: "Nogal Macizo FSC®",
    fabricacion: [
      { label: "Madera", value: "Nogal con certificación FSC® de origen responsable" },
      { label: "Herrajes", value: "Latón macizo con pátina natural satinada" },
      { label: "Ensamble", value: "Artesanal tipo cola de milano y juntas ocultas" },
      { label: "Acabado", value: "Aceites botánicos ecológicos aplicados a mano" }
    ]
  },
  {
    id: "biblioteca-recoleta",
    nombre: "Biblioteca Recoleta",
    precio: 210000,
    categoria: "Estanterías",
    destacado: true,
    medidas: "100 × 35 × 200 cm",
    materiales: "Estructura de acero, estantes de roble",
    descripcion: "Sistema modular de estantes abierto que combina estructura de acero Sage Green y repisas en roble claro.",
    imagen: "assets/img/productos/Biblioteca_Recoleta.png",
    etiqueta: "Roble y Acero",
    fabricacion: [
      { label: "Estructura", value: "Perfiles de acero tubular soldadura continua invisible" },
      { label: "Pintura", value: "Electrostática horneada de alta resistencia en Sage Green" },
      { label: "Repisas", value: "Roble macizo secado en cámara tratadas con barniz al agua" },
      { label: "Sistema", value: "Modular con anclajes ocultos a pared regulables" }
    ]
  },
  {
    id: "butaca-mendoza",
    nombre: "Butaca Mendoza",
    precio: 125000,
    categoria: "Asientos",
    destacado: false,
    medidas: "80 × 75 × 85 cm",
    materiales: "Guatambú macizo, tela bouclé",
    descripcion: "Butaca tapizada en bouclé Dusty Rose con base curva en madera noble de guatambú.",
    imagen: "assets/img/productos/Butaca_Mendoza.png",
    etiqueta: "Guatambú Macizo",
    fabricacion: [
      { label: "Estructura", value: "Guatambú macizo moldeado al vapor" },
      { label: "Tapizado", value: "Género bouclé de textura cerrada tono Dusty Rose" },
      { label: "Relleno", value: "Espuma de alta resiliencia 30 kg/m³ ergonómica" },
      { label: "Terminación", value: "Laca poliuretánica al agua tono mate sedoso" }
    ]
  },
  {
    id: "sillon-copacabana",
    nombre: "Sillón Copacabana",
    precio: 175000,
    categoria: "Asientos",
    destacado: true,
    medidas: "90 × 85 × 95 cm",
    materiales: "Cuero curtido vegetal, acero pintado",
    descripcion: "Sillón lounge en cuero cognac con base giratoria en acero Burnt Sienna. Inspirado en la estética brasilera moderna de los 60.",
    imagen: "assets/img/productos/Sillon_Copacabana.png",
    etiqueta: "Cuero Curtido Vegetal",
    fabricacion: [
      { label: "Tapicería", value: "Cuero natural vacuno curtido 100% al tanino vegetal" },
      { label: "Base", value: "Eje pivotante de acero macizo con giro de 360 grados" },
      { label: "Costuras", value: "Pespuntes dobles a la vista con hilo encerado reforzado" },
      { label: "Mantenimiento", value: "Nutrido inicial con crema de cera de abejas" }
    ]
  },
  {
    id: "mesa-araucaria",
    nombre: "Mesa de Centro Araucaria",
    precio: 140000,
    categoria: "Mesas",
    destacado: false,
    medidas: "90 × 90 × 45 cm",
    materiales: "Sobre de mármol Patagonia, patas de nogal",
    descripcion: "Mesa de centro con sobre circular de mármol Patagonia y base de tres patas en madera de nogal.",
    imagen: "assets/img/productos/Mesa_de_Centro_Araucaria.png",
    etiqueta: "Mármol y Nogal",
    fabricacion: [
      { label: "Superficie", value: "Mármol Patagonia natural con vetas seleccionadas" },
      { label: "Patas", value: "Nogal macizo torneado con ensamble tripode central" },
      { label: "Pulido", value: "Bisel manual con acabado apomazado antirreflejo" },
      { label: "Protección", value: "Tratamiento hidrorrepelente antimanchas de penetración profunda" }
    ]
  },
  {
    id: "mesa-aconcagua",
    nombre: "Mesa de Noche Aconcagua",
    precio: 85000,
    categoria: "Dormitorio",
    destacado: false,
    medidas: "45 × 35 × 60 cm",
    materiales: "Roble macizo FSC®, herrajes soft-close",
    descripcion: "Mesa de noche con cajón oculto y repisa inferior en roble certificado FSC®.",
    imagen: "assets/img/productos/Mesa_de_Noche_Aconcagua.png",
    etiqueta: "Roble Macizo FSC®",
    fabricacion: [
      { label: "Cuerpo", value: "Roble macizo de primera selección con certificación ambiental" },
      { label: "Cajón", value: "Guías ocultas telescópicas con amortiguación soft-close" },
      { label: "Frontal", value: "Tirador rehundido uñero tallado en la misma madera" },
      { label: "Protector", value: "Aceite mineral puro con sellado antihumedad" }
    ]
  },
  {
    id: "sofa-patagonia",
    nombre: "Sofá Patagonia",
    precio: 320000,
    categoria: "Living",
    destacado: true,
    medidas: "220 × 90 × 80 cm",
    materiales: "Madera de eucalipto certificada FSC®, lino natural",
    descripcion: "Sofá de tres cuerpos tapizado en lino Warm Alabaster con patas cónicas de madera y plumón reciclado.",
    imagen: "assets/img/productos/Sofa_Patagonia.png",
    etiqueta: "Lino 100% Natural",
    fabricacion: [
      { label: "Bastidor", value: "Eucalipto Grandis secado en horno libre de deformaciones" },
      { label: "Suspensión", value: "Cincha elástica italiana entrelazada de 80 mm" },
      { label: "Tapizado", value: "Lino 100% prelavado desenfundable Warm Alabaster" },
      { label: "Almohadones", value: "Plumón sintético de fibra virgen reciclada hipoalergénica" }
    ]
  },
  {
    id: "mesa-pampa",
    nombre: "Mesa Comedor Pampa",
    precio: 260000,
    categoria: "Comedor",
    destacado: false,
    medidas: "160-240 × 90 × 75 cm",
    materiales: "Roble macizo FSC®, mecanismo alemán",
    descripcion: "Mesa extensible de roble macizo con tablero biselado y sistema de mariposa central para 6 a 10 comensales.",
    imagen: "assets/img/productos/Mesa_Comedor_Pampa.png",
    etiqueta: "Roble Macizo Extensible",
    fabricacion: [
      { label: "Extensión", value: "Mecanismo central sincronizado tipo mariposa de apertura suave" },
      { label: "Tablero", value: "Duela de roble de 30 mm con bisel inferior a 45°" },
      { label: "Chasis", value: "Refuerzos transversales con tensores metálicos ocultos" },
      { label: "Laca", value: "Poliuretánica al agua de alto impacto para uso intensivo" }
    ]
  },
  {
    id: "sillas-cordoba",
    nombre: "Sillas Córdoba",
    precio: 190000,
    categoria: "Comedor",
    destacado: false,
    medidas: "45 × 52 × 80 cm (c/u)",
    materiales: "Contrachapado nogal, tubo de acero",
    descripcion: "Set de cuatro sillas apilables en contrachapado moldeado de nogal y estructura tubular en Sage Green.",
    imagen: "assets/img/productos/Sillas_Cordoba.png",
    etiqueta: "Set de 4 Sillas",
    fabricacion: [
      { label: "Carcasa", value: "Multilaminado fenólico prensado y chapeado en nogal noble" },
      { label: "Apilabilidad", value: "Diseño ergonómico apilable hasta 6 unidades sin rozar la madera" },
      { label: "Base", value: "Tubo de acero soldado con regatones de fieltro acústicos" },
      { label: "Resistencia", value: "Supera pruebas de carga y fatiga para uso gastronómico" }
    ]
  },
  {
    id: "escritorio-costa",
    nombre: "Escritorio Costa",
    precio: 155000,
    categoria: "Oficina",
    destacado: false,
    medidas: "120 × 60 × 75 cm",
    materiales: "Bambú laminado, herrajes ocultos",
    descripcion: "Escritorio compacto con cajón organizado y tapa pasacables integrada en bambú laminado.",
    imagen: "assets/img/productos/Escritorio_Costa.png",
    etiqueta: "Bambú Sostenible",
    fabricacion: [
      { label: "Material", value: "Placas multilaminadas de bambú de cultivo renovable rápido" },
      { label: "Gestión de cables", value: "Bandeja inferior y pasacables superior fresado a ras" },
      { label: "Almacenaje", value: "Cajón interior compartimentado con corredera invisible" },
      { label: "Sellado", value: "Tratamiento con aceite ecológico impermeable al calor y rayones" }
    ]
  },
  {
    id: "silla-belgrano",
    nombre: "Silla de Trabajo Belgrano",
    precio: 145000,
    categoria: "Oficina",
    destacado: false,
    medidas: "60 × 60 × 90-100 cm",
    materiales: "Malla técnica, tejido reciclado",
    descripcion: "Silla ergonómica regulable en altura con respaldo de malla transpirable y certificación europea EN 1335.",
    imagen: "assets/img/productos/Silla_de_Trabajo_Belgrano.png",
    etiqueta: "Ergonomía Certificada",
    fabricacion: [
      { label: "Malla", value: "Tejido técnico transpirable de alta elasticidad que alivia la columna" },
      { label: "Mecanismo", value: "Basculante sincronizado con bloqueo multiposición y tensión" },
      { label: "Pistón", value: "Cilindro neumático a gas Clase 4 de alta durabilidad y suavidad" },
      { label: "Ruedas", value: "Banda de rodadura de poliuretano blando para pisos de parquet" }
    ]
  }
];