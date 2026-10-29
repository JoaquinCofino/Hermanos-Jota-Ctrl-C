import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Aviso.css';

// Muestra el mensaje que deja una navegación con navigate(ruta, { state: { aviso } }),
// por ejemplo "Se creó el producto" después de crear, editar o eliminar.
export default function Aviso() {
    const location = useLocation();
    const navigate = useNavigate();
    const [aviso, setAviso] = useState(location.state?.aviso ?? null);

    // Se borra el aviso del historial para que no vuelva a aparecer al recargar la página
    useEffect(() => {
        if (location.state?.aviso) {
            navigate(location.pathname, { replace: true, state: null });
        }
    }, [location, navigate]);

    useEffect(() => {
        if (!aviso) return;
        const timer = setTimeout(() => setAviso(null), 4000);
        return () => clearTimeout(timer);
    }, [aviso]);

    if (!aviso) return null;

    return (
        <p className="aviso" role="status">
            <span>✓ {aviso}</span>
            <button type="button" aria-label="Cerrar aviso" onClick={() => setAviso(null)}>
                ×
            </button>
        </p>
    );
}
