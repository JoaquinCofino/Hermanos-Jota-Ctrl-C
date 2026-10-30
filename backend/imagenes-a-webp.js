// Cambia en la base las imágenes del catálogo de .png a .webp (las imágenes se optimizaron).
// A diferencia de "npm run seed", no borra nada: solo actualiza imagenUrl.
// Uso (desde /backend, con MONGO_URI en .env): npm run imagenes:webp
const mongoose = require('mongoose');
const Product = require('./models/Products');

async function pasarAWebp() {
    await mongoose.connect(process.env.MONGO_URI);

    const productos = await Product.find({ imagenUrl: /^assets\/img\/productos\/.+\.png$/ });

    for (const producto of productos) {
        await Product.updateOne(
            { _id: producto._id },
            { imagenUrl: producto.imagenUrl.replace(/\.png$/, '.webp') }
        );
    }

    console.log(`${productos.length} productos actualizados a .webp en ${mongoose.connection.name}`);
    await mongoose.disconnect();
}

pasarAWebp().catch((error) => {
    console.error('Falló la actualización:', error.message);
    process.exit(1);
});
