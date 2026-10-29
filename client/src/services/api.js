// En desarrollo, si REACT_APP_API_URL no está definida, el "proxy" de package.json
// redirige /api a http://localhost:4000. En producción (Vercel), usa REACT_APP_API_URL.
const API_URL = (process.env.REACT_APP_API_URL || '').replace(/\/$/, '');

export async function obtenerProductos(signal) {
    const respuesta = await fetch(`${API_URL}/api/productos`, { signal });

    // fetch solo rechaza por errores de red: un 404 o 500 hay que chequearlo a mano.
    if (!respuesta.ok) {
        throw new Error(`Error ${respuesta.status} al cargar los productos`);
    }

    const productos = await respuesta.json();
    return productos.map((producto) => ({
        ...producto,
        imagen: rutaAbsoluta(producto.imagenUrl || producto.imagen),
        imagenUrl: rutaAbsoluta(producto.imagenUrl || producto.imagen),
    }));
}

// La API devuelve "assets/img/...". Con rutas como /productos/:id, una ruta relativa se
// resolvería como /productos/assets/img/..., así que se convierte a "/assets/img/...".
function rutaAbsoluta(imagen) {
    if (!imagen || /^(https?:)?\//.test(imagen)) return imagen;
    return `/${imagen}`;
}
