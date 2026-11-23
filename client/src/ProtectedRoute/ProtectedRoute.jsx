import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, soloAdmin = false }) {
    const { usuario, cargando } = useAuth();
    const location = useLocation();

    // Mientras se verifica el token guardado, no decidir todavía (evita redirigir a /login al recargar).
    if (cargando) {
        return <p className="estado">Verificando sesión…</p>;
    }

    if (!usuario) {
        return <Navigate to="/login" replace state={{ desde: location.pathname }} />;
    }

    if (soloAdmin && usuario.rol !== 'admin') {
        return (
            <p className="admin-error" role="alert">
                Necesitás ser administrador para ver esta página.
            </p>
        );
    }

    return children;
}
