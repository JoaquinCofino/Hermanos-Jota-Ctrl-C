import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { obtenerPedidos } from '../../services/api';
import { formatearPrecio } from '../../utils/formatearPrecio';
import './MisPedidos.css';

function formatearFecha(fechaISO) {
    return new Date(fechaISO).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

export default function MisPedidos() {
    const { token, logout } = useAuth();
    const [pedidos, setPedidos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [intento, setIntento] = useState(0);

    useEffect(() => {
        const controller = new AbortController();

        setCargando(true);
        setError(null);

        obtenerPedidos(token, controller.signal)
            .then((datos) => setPedidos(Array.isArray(datos) ? datos : []))
            .catch((err) => {
                if (err.name === 'AbortError') return;

                // Sesión vencida: al cerrar sesión, ProtectedRoute manda a /login.
                if (err.status === 401) {
                    logout();
                    return;
                }

                setError('No pudimos cargar tus pedidos. Intentá de nuevo.');
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setCargando(false);
                }
            });

        return () => controller.abort();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, intento]);

    let contenido;

    if (cargando) {
        contenido = <p className="estado">Cargando pedidos…</p>;
    } else if (error) {
        contenido = (
            <div className="estado estado--error">
                <p>{error}</p>
                <button type="button" onClick={() => setIntento((n) => n + 1)}>
                    Reintentar
                </button>
            </div>
        );
    } else if (pedidos.length === 0) {
        contenido = (
            <p className="estado">
                Todavía no hiciste pedidos. <Link to="/productos">Ver catálogo →</Link>
            </p>
        );
    } else {
        contenido = pedidos.map((pedido) => (
            <article key={pedido._id} className="pedido">
                <header className="pedido__encabezado">
                    <span>Pedido del {formatearFecha(pedido.createdAt)}</span>
                    <strong>{formatearPrecio(pedido.total)}</strong>
                </header>

                <ul className="pedido__items">
                    {pedido.items.map((item) => (
                        <li key={item.producto} className="pedido__item">
                            <span>
                                {item.cantidad} × {item.nombre}
                            </span>
                            <span>{formatearPrecio(item.precio * item.cantidad)}</span>
                        </li>
                    ))}
                </ul>
            </article>
        ));
    }

    return (
        <section>
            <header className="seccion-encabezado">
                <h1>Mis pedidos</h1>
                <p className="seccion-subtitulo">Las compras que hiciste en Hermanos Jota.</p>
            </header>

            {contenido}
        </section>
    );
}
