import { useEffect, useState } from 'react';
import Button from '../../components/Button/Button';
import { useAuth } from '../../context/AuthContext';
import { obtenerPedidos, obtenerPerfil } from '../../services/api';
import { formatearPrecio } from '../../utils/formatearPrecio';
import obtenerIniciales from '../../utils/obtenerIniciales';
import './Perfil.css';

function formatearFechaCorta(fechaISO) {
    return new Date(fechaISO).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

function truncarIdPedido(id = '') {
    const texto = String(id);
    return texto.length > 6 ? `#${texto.slice(-6).toUpperCase()}` : `#${texto.toUpperCase()}`;
}

const ICON_PROPS = {
    xmlns: 'http://www.w3.org/2000/svg',
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true
};

function IconoEmail() {
    return (
        <svg {...ICON_PROPS}>
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
    );
}

function IconoEscudo() {
    return (
        <svg {...ICON_PROPS}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}

function IconoPaquete() {
    return (
        <svg {...ICON_PROPS}>
            <path d="m7.5 4.27 9 5.15" />
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
            <path d="m3.3 7 8.7 5 8.7-5" />
            <path d="M12 22V12" />
        </svg>
    );
}

export default function Perfil() {
    const { token, logout } = useAuth();
    const [perfil, setPerfil] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [intento, setIntento] = useState(0);

    const [pedidos, setPedidos] = useState([]);
    const [cargandoPedidos, setCargandoPedidos] = useState(true);
    const [errorPedidos, setErrorPedidos] = useState(false);

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

    useEffect(() => {
        const controller = new AbortController();

        setCargandoPedidos(true);
        setErrorPedidos(false);

        obtenerPedidos(token, controller.signal)
            .then((datos) => setPedidos(Array.isArray(datos) ? datos : []))
            .catch((err) => {
                if (err.name === 'AbortError') return;

                if (err.status === 401) {
                    logout();
                    return;
                }

                setErrorPedidos(true);
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setCargandoPedidos(false);
                }
            });

        return () => controller.abort();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const tipoCuenta = perfil?.rol === 'admin' ? 'Administrador' : 'Cliente';
    const ultimoPedido = pedidos[0] || null;
    const cantidadProductosUltimo = ultimoPedido
        ? ultimoPedido.items.reduce((suma, item) => suma + item.cantidad, 0)
        : 0;

    return (
        <section className="perfil-pagina">
            <header className="seccion-encabezado perfil-pagina__encabezado">
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
                <div className="perfil-grid">
                    <article className="perfil-card perfil-resumen">
                        <div className="perfil-resumen__cabecera">
                            <div className="perfil-avatar" aria-hidden="true">
                                {obtenerIniciales(perfil.nombre)}
                            </div>

                            <h2 className="perfil-resumen__nombre">{perfil.nombre}</h2>

                            <span className="perfil-badge">{tipoCuenta}</span>
                        </div>

                        <ul className="perfil-datos">
                            <li className="perfil-datos__fila">
                                <span className="perfil-datos__icono">
                                    <IconoEmail />
                                </span>
                                <div className="perfil-datos__texto">
                                    <span className="perfil-datos__label">Email</span>
                                    <span className="perfil-datos__valor">{perfil.email}</span>
                                </div>
                            </li>
                            <li className="perfil-datos__fila">
                                <span className="perfil-datos__icono">
                                    <IconoEscudo />
                                </span>
                                <div className="perfil-datos__texto">
                                    <span className="perfil-datos__label">Tipo de cuenta</span>
                                    <span className="perfil-datos__valor">{tipoCuenta}</span>
                                </div>
                            </li>
                        </ul>
                    </article>

                    <article className="perfil-card perfil-pedidos">
                        <div className="perfil-pedidos__contenido">
                            <div className="perfil-card__cabecera">
                                <span className="perfil-card__icono">
                                    <IconoPaquete />
                                </span>
                                <div>
                                    <span className="perfil-card__eyebrow">Actividad</span>
                                    <h2 className="perfil-card__titulo">Mis pedidos</h2>
                                </div>
                            </div>

                            <p className="perfil-pedidos__descripcion">
                                Consultá el historial y el estado de tus compras.
                            </p>

                            {cargandoPedidos && (
                                <div
                                    className="perfil-ultimo-pedido perfil-ultimo-pedido--skeleton"
                                    aria-busy="true"
                                    aria-label="Cargando último pedido"
                                >
                                    <div className="perfil-skeleton-linea perfil-skeleton-linea--corta" />
                                    <div className="perfil-skeleton-linea perfil-skeleton-linea--media" />
                                    <div className="perfil-skeleton-linea" />
                                </div>
                            )}

                            {!cargandoPedidos && !errorPedidos && ultimoPedido && (
                                <div className="perfil-ultimo-pedido">
                                    <div className="perfil-ultimo-pedido__fila">
                                        <span className="perfil-ultimo-pedido__etiqueta">
                                            Último pedido
                                        </span>
                                        <span className="perfil-ultimo-pedido__fecha">
                                            {formatearFechaCorta(ultimoPedido.createdAt)}
                                        </span>
                                    </div>

                                    <div className="perfil-ultimo-pedido__fila perfil-ultimo-pedido__fila--principal">
                                        <span className="perfil-ultimo-pedido__id">
                                            <span className="perfil-ultimo-pedido__codigo">
                                                {truncarIdPedido(ultimoPedido._id)}
                                            </span>
                                        </span>
                                        <span className="perfil-ultimo-pedido__estado">
                                            {ultimoPedido.estado || 'Confirmado'}
                                        </span>
                                    </div>

                                    <div className="perfil-ultimo-pedido__fila perfil-ultimo-pedido__fila--resumen">
                                        <span className="perfil-ultimo-pedido__cantidad">
                                            {cantidadProductosUltimo}{' '}
                                            {cantidadProductosUltimo === 1 ? 'producto' : 'productos'}
                                        </span>
                                        <strong className="perfil-ultimo-pedido__total">
                                            {formatearPrecio(ultimoPedido.total)}
                                        </strong>
                                    </div>
                                </div>
                            )}

                            {!cargandoPedidos && !errorPedidos && !ultimoPedido && (
                                <div className="perfil-sin-pedidos">
                                    <p className="perfil-sin-pedidos__texto">
                                        Todavía no realizaste compras.
                                    </p>
                                    <Button to="/productos" variant="ghost" size="sm" arrow="right">
                                        Ver catálogo
                                    </Button>
                                </div>
                            )}
                        </div>

                        <div className="perfil-pedidos__acciones">
                            <Button to="/mis-pedidos" variant="primary" arrow="right" className="perfil-pedidos__cta">
                                Ver mis pedidos
                            </Button>
                        </div>
                    </article>
                </div>
            )}
        </section>
    );
}
