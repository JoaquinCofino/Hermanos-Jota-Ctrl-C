import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { obtenerPerfil } from '../../services/api';
import './Perfil.css';

export default function Perfil() {
    const { token, logout } = useAuth();
    const [perfil, setPerfil] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [intento, setIntento] = useState(0);

    useEffect(() => {
        const controller = new AbortController();

        setCargando(true);
        setError(null);

        obtenerPerfil(token, controller.signal)
            .then((datos) => setPerfil(datos))
            .catch((err) => {
                if (err.name === 'AbortError') return;

                // Sesión vencida: al cerrar sesión, ProtectedRoute manda a /login.
                if (err.status === 401) {
                    logout();
                    return;
                }

                setError('No pudimos cargar tu perfil. Intentá de nuevo.');
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setCargando(false);
                }
            });

        return () => controller.abort();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, intento]);

    return (
        <section>
            <header className="seccion-encabezado">
                <h1>Mi perfil</h1>
                <p className="seccion-subtitulo">Los datos asociados a tu cuenta.</p>
            </header>

            {cargando && <p className="estado">Cargando perfil…</p>}

            {!cargando && error && (
                <div className="estado estado--error">
                    <p>{error}</p>
                    <button type="button" onClick={() => setIntento((n) => n + 1)}>
                        Reintentar
                    </button>
                </div>
            )}

            {!cargando && !error && perfil && (
                <dl className="perfil">
                    <dt>Nombre</dt>
                    <dd>{perfil.nombre}</dd>

                    <dt>Email</dt>
                    <dd>{perfil.email}</dd>

                    <dt>Tipo de cuenta</dt>
                    <dd>{perfil.rol === 'admin' ? 'Administrador' : 'Cliente'}</dd>
                </dl>
            )}

            <p>
                <Link to="/mis-pedidos">Ver mis pedidos →</Link>
            </p>
        </section>
    );
}
