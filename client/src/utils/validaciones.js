export const NOMBRE_MIN = 2;
export const PASSWORD_MIN = 6;

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function esEmailValido(email) {
    const valor = String(email ?? '').trim();
    return REGEX_EMAIL.test(valor) && !valor.includes('..');
}

export function validarNombre(valor) {
    const nombre = String(valor ?? '').trim();
    if (!nombre) return 'Ingresá tu nombre.';
    if (nombre.length < NOMBRE_MIN) {
        return `El nombre debe tener al menos ${NOMBRE_MIN} caracteres.`;
    }
    return '';
}

export function validarEmail(valor) {
    const email = String(valor ?? '').trim();
    if (!email) return 'Ingresá tu email.';
    if (!esEmailValido(email)) {
        return 'El email no tiene un formato válido (ej: nombre@dominio.com).';
    }
    return '';
}

export function validarPasswordLogin(valor) {
    if (!valor) return 'Ingresá tu contraseña.';
    return '';
}

export function validarPasswordRegistro(valor) {
    if (!valor) return 'Creá una contraseña.';
    if (valor.length < PASSWORD_MIN) {
        return `La contraseña debe tener al menos ${PASSWORD_MIN} caracteres.`;
    }
    return '';
}

export function validarMensaje(valor) {
    if (!String(valor ?? '').trim()) return 'Escribí tu mensaje.';
    return '';
}

const MSG_SIN_CONEXION =
    'No pudimos conectarnos con el servidor. Revisá tu conexión e intentá de nuevo.';
const MSG_SERVIDOR =
    'Tuvimos un problema de nuestro lado. Intentá de nuevo en unos minutos.';

function mensajeGenerico(err) {
    if (!err?.status) return MSG_SIN_CONEXION;
    if (err.status >= 500) return MSG_SERVIDOR;
    return err.message || MSG_SERVIDOR;
}

export function mensajeErrorLogin(err) {
    if (err?.status === 401) return 'El email o la contraseña no son correctos.';
    return mensajeGenerico(err);
}

export function resolverErrorRegistro(err) {
    if (err?.status === 409) {
        return { campo: 'email', mensaje: 'Ya existe una cuenta con ese email.' };
    }
    return { campo: null, mensaje: mensajeGenerico(err) };
}