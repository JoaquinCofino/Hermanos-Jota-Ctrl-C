// En desarrollo, el "proxy" de package.json redirige /api a http://localhost:4000,
// así que no hace falta CORS ni escribir la URL completa del backend.
const API_URL = process.env.REACT_APP_API_URL || '';

export async function obtenerProductos(signal) {
    const respuesta = await fetch(`${API_URL}/api/productos`, { signal });

    // fetch solo rechaza por errores de red: un 404 o 500 hay que chequearlo a mano.
    if (!respuesta.ok) {
        throw new Error(`Error ${respuesta.status} al cargar los productos`);
    }

    const productos = await respuesta.json();
    return productos.map((producto) => ({ ...producto, imagen: rutaAbsoluta(producto.imagen) }));
}

// La API devuelve "assets/img/...". Con rutas como /productos/:id, una ruta relativa se
// resolvería como /productos/assets/img/..., así que se convierte a "/assets/img/...".
function rutaAbsoluta(imagen) {
    if (!imagen || /^(https?:)?\//.test(imagen)) return imagen;
    return `/${imagen}`;
}
