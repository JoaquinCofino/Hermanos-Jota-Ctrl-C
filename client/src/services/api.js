// En desarrollo, el "proxy" de package.json redirige /api a http://localhost:4000,
// así que no hace falta CORS ni escribir la URL completa del backend.
// En producción (Vercel) REACT_APP_API_URL apunta al backend en Render, ej: https://xxx.onrender.com
// Se le saca la "/" final para no terminar pidiendo "//api/productos".
const API_URL = (process.env.REACT_APP_API_URL || '').replace(/\/+$/, '');

// Imagen que se muestra cuando un producto no tiene imagenUrl
const IMAGEN_POR_DEFECTO = '/assets/img/productos/sin-imagen.svg';

// Hace la petición y devuelve el JSON. Si el backend responde con error, lanza un Error
// con el mensaje que mandó el servidor ("mensaje" en el CRUD, "message" en el handler central).
async function pedir(ruta, { body, ...opciones } = {}) {
    const respuesta = await fetch(`${API_URL}${ruta}`, {
        ...opciones,
        // El Content-Type solo hace falta cuando se manda un body (POST / PUT)
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined
    });

    const datos = await respuesta.json().catch(() => null);

    // fetch solo rechaza por errores de red: un 404 o 500 hay que chequearlo a mano.
    if (!respuesta.ok) {
        throw new Error(datos?.mensaje || datos?.message || `Error ${respuesta.status}`);
    }

    return datos;
}

export async function obtenerProductos(signal) {
    const productos = await pedir('/api/productos', { signal });
    return productos.map(normalizarProducto);
}

// POST /api/productos — devuelve el producto creado (con su _id de Mongo)
export async function crearProducto(datos) {
    const creado = await pedir('/api/productos', { method: 'POST', body: datos });
    return normalizarProducto(creado);
}

// PUT /api/productos/:id — devuelve el producto ya actualizado
export async function actualizarProducto(id, datos) {
    const actualizado = await pedir(`/api/productos/${encodeURIComponent(id)}`, {
        method: 'PUT',
        body: datos
    });
    return normalizarProducto(actualizado);
}

// DELETE /api/productos/:id
export async function eliminarProducto(id) {
    await pedir(`/api/productos/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

// Con MongoDB el backend devuelve "_id" e "imagenUrl"; el frontend usa "id" e "imagen".
// Se aceptan los dos formatos para que funcione con el backend viejo y con el nuevo.
function normalizarProducto(producto) {
    return {
        ...producto,
        id: String(producto.id ?? producto._id),
        imagen: rutaImagen(producto.imagen ?? producto.imagenUrl)
    };
}

// La API devuelve "assets/img/...". Con rutas como /productos/:id, una ruta relativa se
// resolvería como /productos/assets/img/..., así que se convierte a "/assets/img/...".
export function rutaImagen(imagen) {
    if (!imagen || !imagen.trim()) return IMAGEN_POR_DEFECTO;
    if (/^(https?:)?\//.test(imagen)) return imagen;
    return `/${imagen}`;
}
