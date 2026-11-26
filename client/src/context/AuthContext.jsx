import { createContext, useContext, useEffect, useState } from 'react';
import { iniciarSesion, obtenerPerfil, registrarUsuario } from '../services/api';

const AuthContext = createContext(null);
const SESION_KEY = 'hj_sesion';

function leerSesion() {
    try {
        return JSON.parse(localStorage.getItem(SESION_KEY));
    } catch {
        return null;
    }
}

function guardarSesion(datos) {
    try {
        localStorage.setItem(SESION_KEY, JSON.stringify(datos));
    } catch {
        // Si localStorage falla, la sesión sigue funcionando en memoria.
    }
}

export function AuthProvider({ children }) {
    // La sesión es lo que devuelve el login: { token, usuario }. Sin sesión: null.
    const [sesion, setSesion] = useState(leerSesion);

    // Si hay un token guardado, arrancamos "cargando" hasta verificarlo con el backend.
    // ProtectedRoute espera a que termine para no mandar a /login por error al recargar.
    const [cargando, setCargando] = useState(() => Boolean(leerSesion()?.token));

    function logout() {
        localStorage.removeItem(SESION_KEY);
        setSesion(null);
    }

    async function login(email, password) {
        const datos = await iniciarSesion(email, password);
        guardarSesion(datos);
        setSesion(datos);
    }

    // Crea la cuenta y deja al usuario logueado.
    async function registrar(nombre, email, password) {
        await registrarUsuario(nombre, email, password);
        await login(email, password);
    }

    // Al iniciar la app: verificar el token guardado con GET /api/usuarios/perfil.
    useEffect(() => {
        const guardada = leerSesion();

        if (!guardada?.token) {
            setCargando(false);
            return;
        }

        const controller = new AbortController();

        obtenerPerfil(guardada.token, controller.signal)
            .then((usuario) => {
                const actualizada = { token: guardada.token, usuario };
                guardarSesion(actualizada);
                setSesion(actualizada);
            })
            .catch((err) => {
                if (err.name === 'AbortError') return;

                // 401: token inválido o expirado -> se cierra la sesión.
                // Otros errores (ej. servidor caído) no cierran la sesión.
                if (err.status === 401) {
                    logout();
                }
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setCargando(false);
                }
            });

        return () => controller.abort();
    }, []);

    const valor = {
        usuario: sesion ? sesion.usuario : null,
        token: sesion ? sesion.token : null,
        cargando,
        login,
        registrar,
        logout
    };

    return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}
