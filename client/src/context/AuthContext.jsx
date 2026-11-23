import { createContext, useContext, useState } from 'react';
import { iniciarSesion } from '../services/api';

const AuthContext = createContext(null);
const SESION_KEY = 'hj_sesion';

function leerSesion() {
    try {
        return JSON.parse(localStorage.getItem(SESION_KEY));
    } catch {
        return null;
    }
}

export function AuthProvider({ children }) {
    // La sesión es lo que devuelve el login: { token, usuario }. Sin sesión: null.
    const [sesion, setSesion] = useState(leerSesion);

    async function login(email, password) {
        const datos = await iniciarSesion(email, password);
        localStorage.setItem(SESION_KEY, JSON.stringify(datos));
        setSesion(datos);
    }

    function logout() {
        localStorage.removeItem(SESION_KEY);
        setSesion(null);
    }

    const valor = {
        usuario: sesion ? sesion.usuario : null,
        token: sesion ? sesion.token : null,
        login,
        logout
    };

    return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}
