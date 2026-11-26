import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from '../../components/BrandLogo/BrandLogo';
import Button from '../../components/Button/Button';
import { useAuth } from '../../context/AuthContext';
import { obtenerPedidos, rutaImagen } from '../../services/api';
import { formatearPrecio } from '../../utils/formatearPrecio';
import './MisPedidos.css';

const LIMITE_VISIBLE = 2;

function truncarIdPedido(id = '') {
    const texto = String(id);
    return texto.length > 6 ? `#${texto.slice(-6).toUpperCase()}` : `#${texto.toUpperCase()}`;
}

function formatearFechaPedido(fechaISO) {
    const fecha = new Date(fechaISO);
    const partes = new Intl.DateTimeFormat('es-AR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    }).formatToParts(fecha);

    const dia = partes.find((p) => p.type === 'day')?.value || '';
    const mes = (partes.find((p) => p.type === 'month')?.value || '').replace(/\.$/, '');
    const anio = partes.find((p) => p.type === 'year')?.value || '';
    const hora = fecha.toLocaleTimeString('es-AR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });

    return `${dia} de ${mes} de ${anio} · ${hora} hs`;
}

function IconoCaja({ size = 22 }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="m7.5 4.27 9 5.15" />
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
            <path d="m3.3 7 8.7 5 8.7-5" />
            <path d="M12 22V12" />
        </svg>
    );
}

function IconoChevron({ rotado = false }) {
    return (
        <svg
            className={`pedido-toggle__icono ${rotado ? 'pedido-toggle__icono--rotado' : ''}`}
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="m6 9 6 6 6-6" />
        </svg>
    );
}

function MiniaturaProducto({ src, alt }) {
    const [errorImg, setErrorImg] = useState(false);

    if (!src || errorImg) {
        return (
            <div className="pedido-item__thumb pedido-item__thumb--fallback" aria-hidden="true">
                <BrandLogo variant="suave" width={28} decorative />
            </div>
        );
    }

    return (
        <div className="pedido-item__thumb">
            <img
                src={src}
                alt={alt}
                loading="lazy"
                onError={() => setErrorImg(true)}
            />
        </div>
    );
}

function TarjetaPedido({ pedido, productosPorId }) {
    const [expandido, setExpandido] = useState(false);

    const items = pedido.items || [];
    const esColapsable = items.length >= 3;
    const itemsVisibles = esColapsable && !expandido ? items.slice(0, LIMITE_VISIBLE) : items;
    const cantidadOculta = items.length - LIMITE_VISIBLE;

    const totalUnidades = items.reduce((suma, item) => suma + item.cantidad, 0);
    const listaId = `pedido-items-${pedido._id}`;

    return (
        <article className="pedido-card">
            <header className="pedido-card__encabezado">
                <div className="pedido-card__fila-superior">
                    <h2 className="pedido-card__id">
                        <span className="pedido-card__codigo">
                            {truncarIdPedido(pedido._id)}
                        </span>
                    </h2>
                    <span className="pedido-card__estado">
                        {pedido.estado || 'Confirmado'}
                    </span>
                </div>

                <div className="pedido-card__fila-meta">
                    <span className="pedido-card__fecha">
                        {formatearFechaPedido(pedido.createdAt)}
                    </span>
                    <span className="pedido-card__unidades">
                        {totalUnidades} {totalUnidades === 1 ? 'producto' : 'productos'}
                    </span>
                </div>
            </header>

            <ul id={listaId} className="pedido-items">
                {itemsVisibles.map((item, indice) => {
                    const productoId =
                        typeof item.producto === 'object' && item.producto !== null
                            ? String(item.producto._id || item.producto.id || '')
                            : String(item.producto || '');

                    const productoCatalogo = productosPorId.get(productoId);
                    const imagenCruda =
                        item.imagenUrl ||
                        (typeof item.producto === 'object' ? item.producto?.imagenUrl : null) ||
                        productoCatalogo?.imagenUrl ||
                        productoCatalogo?.imagen ||
                        null;

                    const imagenSrc = imagenCruda ? rutaImagen(imagenCruda) : null;
                    const subtotal = item.precio * item.cantidad;

                    return (
                        <li key={`${productoId}-${indice}`} className="pedido-item">
                            <MiniaturaProducto src={imagenSrc} alt={item.nombre} />

                            <div className="pedido-item__cuerpo">
                                <div className="pedido-item__info">
                                    {productoCatalogo ? (
                                        <Link
                                            className="pedido-item__nombre pedido-item__nombre--link"
                                            to={`/productos/${productoCatalogo.id}`}
                                        >
                                            {item.nombre}
                                        </Link>
                                    ) : (
                                        <span className="pedido-item__nombre">{item.nombre}</span>
                                    )}

                                    <span className="pedido-item__detalle">
                                        {item.cantidad} u. · {formatearPrecio(item.precio)} c/u
                                    </span>
                                </div>

                                <span className="pedido-item__subtotal">
                                    {formatearPrecio(subtotal)}
                                </span>
                            </div>
                        </li>
                    );
                })}
            </ul>

            {esColapsable && (
                <div className="pedido-toggle-contenedor">
                    <button
                        type="button"
                        className="pedido-toggle"
                        aria-expanded={expandido}
                        aria-controls={listaId}
                        onClick={() => setExpandido((prev) => !prev)}
                    >
                        <span>
                            {expandido
                                ? 'Mostrar menos'
                                : `Ver ${cantidadOculta} ${
                                      cantidadOculta === 1 ? 'producto' : 'productos'
                                  } más`}
                        </span>
                        <IconoChevron rotado={expandido} />
                    </button>
                </div>
            )}

            <footer className="pedido-card__pie">
                <span className="pedido-card__total-label">Total</span>
                <strong className="pedido-card__total-valor">
                    {formatearPrecio(pedido.total)}
                </strong>
            </footer>
        </article>
    );
}

function SkeletonPedidos() {
    return (
        <div className="pedidos-lista" aria-busy="true" aria-label="Cargando pedidos">
            {[0, 1].map((n) => (
                <div key={n} className="pedido-card pedido-card--skeleton">
                    <div className="pedido-card__encabezado">
                        <div className="pedido-skeleton-linea pedido-skeleton-linea--titulo" />
                        <div className="pedido-skeleton-linea pedido-skeleton-linea--meta" />
                    </div>
                    <div className="pedido-skeleton-cuerpo">
                        <div className="pedido-skeleton-fila">
                            <div className="pedido-skeleton-thumb" />
                            <div className="pedido-skeleton-texto">
                                <div className="pedido-skeleton-linea pedido-skeleton-linea--media" />
                                <div className="pedido-skeleton-linea pedido-skeleton-linea--corta" />
                            </div>
                        </div>
                    </div>
                    <div className="pedido-card__pie">
                        <div className="pedido-skeleton-linea pedido-skeleton-linea--corta" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function MisPedidos({ productos = [] }) {
    const { token, logout } = useAuth();
    const [pedidos, setPedidos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [intento, setIntento] = useState(0);

    const productosPorId = useMemo(() => {
        const mapa = new Map();
        for (const prod of productos) {
            if (prod?.id) mapa.set(String(prod.id), prod);
            if (prod?._id) mapa.set(String(prod._id), prod);
        }
        return mapa;
    }, [productos]);

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

    return (
        <section className="pedidos-pagina">
            <header className="seccion-encabezado pedidos-pagina__encabezado">
                <h1>Mis pedidos</h1>
                <p className="seccion-subtitulo">Las compras que hiciste en Hermanos Jota.</p>
                {!cargando && !error && pedidos.length > 0 && (
                    <p className="pedidos-pagina__contador">
                        {pedidos.length}{' '}
                        {pedidos.length === 1 ? 'pedido realizado' : 'pedidos realizados'}
                    </p>
                )}
            </header>

            {cargando && <SkeletonPedidos />}

            {!cargando && error && (
                <div className="pedidos-estado pedidos-estado--error" role="alert">
                    <p>{error}</p>
                    <Button variant="primary" onClick={() => setIntento((n) => n + 1)}>
                        Reintentar
                    </Button>
                </div>
            )}

            {!cargando && !error && pedidos.length === 0 && (
                <div className="pedidos-estado pedidos-estado--vacio">
                    <div className="pedidos-estado__icono" aria-hidden="true">
                        <IconoCaja size={28} />
                    </div>
                    <h2 className="pedidos-estado__titulo">Todavía no realizaste compras</h2>
                    <p className="pedidos-estado__texto">
                        Cada pieza cuenta la historia de manos expertas y materiales nobles.
                        Cuando confirmes tu primer pedido, vas a poder seguirlo desde acá.
                    </p>
                    <Button to="/productos" variant="primary" arrow="right">
                        Ver catálogo
                    </Button>
                </div>
            )}

            {!cargando && !error && pedidos.length > 0 && (
                <div className="pedidos-lista">
                    {pedidos.map((pedido) => (
                        <TarjetaPedido
                            key={pedido._id}
                            pedido={pedido}
                            productosPorId={productosPorId}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
