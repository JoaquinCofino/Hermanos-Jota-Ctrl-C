const mongoose = require('mongoose');
const Product = require('./models/Products');
const Categoria = require('./models/Categoria');
const productos = require('./data/productos');

async function seed() {
await mongoose.connect(process.env.MONGO_URI);

const nombresCategoria = [...new Set(productos.map((p) => p.categoria))];
await Categoria.deleteMany({});
const categorias = await Categoria.insertMany(
  nombresCategoria.map((nombre) => ({ nombre }))
);
console.log(`🌱 ${categorias.length} categorías cargadas en ${mongoose.connection.name}`);

// El array usa "imagen" e "id"; el modelo usa "imagenUrl" y Mongo pone su propio _id.
const categoriasPorNombre = Object.fromEntries(
  categorias.map((c) => [c.nombre, c._id])
);
const documentos = productos.map(({ id, imagen, categoria, ...resto }) => ({
  ...resto,
  imagenUrl: imagen,
  categoria: categoriasPorNombre[categoria]
}));

await Product.deleteMany({});
const creados = await Product.insertMany(documentos);
console.log(`🌱 ${creados.length} productos cargados en ${mongoose.connection.name}`);

await mongoose.disconnect();
}

seed().catch((error) => {
console.error(':x: Falló el seed:', error.message);
process.exit(1);
});