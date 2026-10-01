// En desarrollo, el "proxy" de package.json redirige /api y /assets a http://localhost:4000,
// así que no hace falta CORS ni escribir la URL completa del backend.
const API_URL = process.env.REACT_APP_API_URL || '';

export async function obtenerProductos(signal) {
    const respuesta = await fetch(`${API_URL}/api/productos`, { signal });

    // fetch solo rechaza por errores de red: un 404 o 500 hay que chequearlo a mano.
    if (!respuesta.ok) {
        throw new Error(`Error ${respuesta.status} al cargar los productos`);
    }

    return respuesta.json();
}

// El backend puede devolver la imagen como ruta relativa ("assets/img/...") o como URL completa.
export function urlImagen(imagen) {
    if (!imagen || /^https?:\/\//.test(imagen)) return imagen;
    return `${API_URL}/${imagen.replace(/^\//, '')}`;
}
