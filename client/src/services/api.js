// En desarrollo, si REACT_APP_API_URL no está definida, el proxy de package.json
// redirige /api a http://localhost:4000.
// En producción (Vercel), usa REACT_APP_API_URL.
const API_URL = (process.env.REACT_APP_API_URL || '').replace(/\/$/, '');

const IMAGEN_POR_DEFECTO = '/assets/img/productos/sin-imagen.png';

// Hace la petición y devuelve el JSON.
// Si recibe "token", manda el header Authorization: Bearer <token>.
async function pedir(ruta, { body, token, ...opciones } = {}) {
    const headers = {};

    if (body) headers['Content-Type'] = 'application/json';
    if (token) headers.Authorization = `Bearer ${token}`;

    const respuesta = await fetch(`${API_URL}${ruta}`, {
        ...opciones,
        headers,
        body: body ? JSON.stringify(body) : undefined
    });

    const datos = await respuesta.json().catch(() => null);

    if (!respuesta.ok) {
        const error = new Error(
            datos?.error ||
            datos?.mensaje ||
            datos?.message ||
            `Error ${respuesta.status}`
        );
        // El status permite distinguir, por ejemplo, un 401 (sesión inválida) de otros errores.
        error.status = respuesta.status;
        throw error;
    }

    return datos;
}

// POST /api/usuarios/login -> { token, usuario }
export function iniciarSesion(email, password) {
    return pedir('/api/usuarios/login', {
        method: 'POST',
        body: { email, password }
    });
}

// POST /api/usuarios/registro -> { _id, nombre, email, rol }
export function registrarUsuario(nombre, email, password) {
    return pedir('/api/usuarios/registro', {
        method: 'POST',
        body: { nombre, email, password }
    });
}

// GET /api/usuarios/perfil (requiere token) -> { _id, nombre, email, rol }
export function obtenerPerfil(token, signal) {
    return pedir('/api/usuarios/perfil', { token, signal });
}

// POST /api/pedidos (requiere token). items: [{ id, cantidad }]
// El backend calcula precios y total con los datos de la base.
export function crearPedido(items, token) {
    return pedir('/api/pedidos', {
        method: 'POST',
        body: { items },
        token
    });
}

// GET /api/pedidos (requiere token) -> pedidos del usuario autenticado
export function obtenerPedidos(token, signal) {
    return pedir('/api/pedidos', { token, signal });
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

// POST /api/productos (requiere token de admin)
export async function crearProducto(datos, token) {
    const datosProducto = {
        ...datos,
        imagenUrl: datos.imagenUrl?.trim() || IMAGEN_POR_DEFECTO
    };

    const creado = await pedir('/api/productos', {
        method: 'POST',
        body: datosProducto,
        token
    });

    return normalizarProducto(creado);
}

// PUT /api/productos/:id (requiere token de admin)
export async function actualizarProducto(id, datos, token) {
    const actualizado = await pedir(
        `/api/productos/${encodeURIComponent(id)}`,
        {
            method: 'PUT',
            body: datos,
            token
        }
    );

    return normalizarProducto(actualizado);
}

// DELETE /api/productos/:id (requiere token de admin)
export async function eliminarProducto(id, token) {
    await pedir(
        `/api/productos/${encodeURIComponent(id)}`,
        { method: 'DELETE', token }
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
