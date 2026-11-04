// En desarrollo, si REACT_APP_API_URL no está definida, el proxy de package.json
// redirige /api a http://localhost:4000.
// En producción (Vercel), usa REACT_APP_API_URL.
const API_URL = (process.env.REACT_APP_API_URL || '').replace(/\/$/, '');

const IMAGEN_POR_DEFECTO = '/assets/img/productos/sin-imagen.png';

// Hace la petición y devuelve el JSON.
async function pedir(ruta, { body, ...opciones } = {}) {
    const respuesta = await fetch(`${API_URL}${ruta}`, {
        ...opciones,
        headers: body
            ? { 'Content-Type': 'application/json' }
            : undefined,
        body: body ? JSON.stringify(body) : undefined
    });

    const datos = await respuesta.json().catch(() => null);

    if (!respuesta.ok) {
        throw new Error(
            datos?.error ||
            datos?.mensaje ||
            datos?.message ||
            `Error ${respuesta.status}`
        );
    }

    return datos;
}

// GET /api/productos
export async function obtenerProductos(signal) {
    const productos = await pedir('/api/productos', { signal });
    return productos.map(normalizarProducto);
}

// GET /api/categorias
export async function obtenerCategorias(signal) {
    const categorias = await pedir('/api/categorias', { signal });
    return Array.isArray(categorias) ? categorias : [];
}

// POST /api/productos
export async function crearProducto(datos) {
    const datosProducto = {
        ...datos,
        imagenUrl: datos.imagenUrl?.trim() || IMAGEN_POR_DEFECTO
    };

    const creado = await pedir('/api/productos', {
        method: 'POST',
        body: datosProducto
    });

    return normalizarProducto(creado);
}

// PUT /api/productos/:id
export async function actualizarProducto(id, datos) {
    const actualizado = await pedir(
        `/api/productos/${encodeURIComponent(id)}`,
        {
            method: 'PUT',
            body: datos
        }
    );

    return normalizarProducto(actualizado);
}

// DELETE /api/productos/:id
export async function eliminarProducto(id) {
    await pedir(
        `/api/productos/${encodeURIComponent(id)}`,
        { method: 'DELETE' }
    );
}

// Normaliza los datos que devuelve MongoDB para el frontend.
function normalizarProducto(producto) {
    const imagenOriginal = producto.imagenUrl ?? producto.imagen ?? '';
    const imagenFinal = rutaImagen(imagenOriginal);

    return {
        ...producto,
        id: String(producto.id ?? producto._id),
        imagenUrl: imagenOriginal || IMAGEN_POR_DEFECTO,
        imagen: imagenFinal
    };
}

// Convierte las rutas relativas de imágenes en rutas desde la raíz.
export function rutaImagen(imagen) {
    if (!imagen || !imagen.trim()) return IMAGEN_POR_DEFECTO;

    if (/^(https?:)?\//.test(imagen)) return imagen;

    return `/${imagen}`;
}