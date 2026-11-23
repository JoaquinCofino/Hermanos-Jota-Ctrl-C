import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { crearPedido } from '../../services/api';
import { formatearPrecio } from '../../utils/formatearPrecio';
import './Carrito.css';

export default function Carrito() {
    const { carrito, agregar, restar, quitar, vaciar, total } = useCart();
    const { usuario, token, logout } = useAuth();
    const navigate = useNavigate();
    const [compraRealizada, setCompraRealizada] = useState(false);
    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState(null);

    const irALogin = () => {
        navigate('/login', { state: { desde: '/carrito' } });
    };

    const handleFinalizarCompra = async () => {
        if (carrito.length === 0 || enviando) return;

        // Solo se puede comprar con sesión: el pedido queda asociado a la cuenta.
        if (!usuario) {
            irALogin();
            return;
        }

        setError(null);
        setEnviando(true);

        try {
            // Solo mandamos id y cantidad: precios y total los calcula el backend.
            await crearPedido(
                carrito.map((item) => ({ id: item.id, cantidad: item.cantidad })),
                token
            );

            // El carrito se vacía solo si el pedido se registró bien.
            vaciar();
            setCompraRealizada(true);
        } catch (err) {
            // Si falla, el carrito queda como estaba.
            if (err.status === 401) {
                logout();
                irALogin();
                return;
            }

            setError(err.message || 'No pudimos registrar tu pedido. Intentá de nuevo.');
        } finally {
            setEnviando(false);
        }
    };

    if (carrito.length === 0) {
        return (
            <section>
                <header className="seccion-encabezado">
                    <h1>Tu Carrito</h1>
                    <p className="seccion-subtitulo">
                        Revisá tu selección de piezas artesanales antes de finalizar tu compra.
                    </p>
                </header>
                <p className="estado">
                    {compraRealizada ? (
                        <>
                            ¡Tu pedido fue registrado! Muchas gracias por elegirnos.{' '}
                            <Link to="/mis-pedidos">Ver mis pedidos →</Link>{' '}
                            <Link to="/productos">Seguir explorando el catálogo →</Link>
                        </>
                    ) : (
                        <>Tu carrito está vacío. <Link to="/productos">Ver catálogo →</Link></>
                    )}
                </p>
            </section>
        );
    }

    return (
        <section>
            <header className="seccion-encabezado">
                <h1>Tu Carrito</h1>
                <p className="seccion-subtitulo">
                    Revisá tu selección de piezas artesanales antes de finalizar tu compra.
                </p>
            </header>

            {carrito.map((producto) => {
                const cantidad = producto.cantidad;
                const imagenSrc =
                    producto.imagenUrl?.startsWith('http') || producto.imagenUrl?.startsWith('/')
                        ? producto.imagenUrl
                        : `/${producto.imagenUrl}`;

                return (
                    <article key={producto.id} className="fila-carrito">
                        <img className="fila-carrito__img" src={imagenSrc} alt={producto.nombre} />
                        <div className="fila-carrito__info">
                            <h3>{producto.nombre}</h3>
                            <p className="categoria">{formatearPrecio(producto.precio)} c/u</p>
                        </div>
                        <div className="fila-carrito__cantidad">
                            <button type="button" aria-label="Quitar una unidad" onClick={() => restar(producto.id)}>
                                −
                            </button>
                            <span>{cantidad}</span>
                            <button type="button" aria-label="Agregar una unidad" onClick={() => agregar(producto)}>
                                +
                            </button>
                        </div>
                        <p className="fila-carrito__subtotal">{formatearPrecio(producto.precio * cantidad)}</p>
                        <button
                            type="button"
                            className="fila-carrito__quitar"
                            aria-label="Quitar producto"
                            onClick={() => quitar(producto.id)}
                        >
                            ✕
                        </button>
                    </article>
                );
            })}

            <div className="resumen-carrito">
                <span>Total</span>
                <span>{formatearPrecio(total)}</span>
            </div>

            {error && (
                <p className="estado estado--error" role="alert">
                    {error}
                </p>
            )}

            {!usuario && (
                <p className="estado">
                    Para finalizar la compra necesitás{' '}
                    <Link to="/login" state={{ desde: '/carrito' }}>ingresar</Link> o{' '}
                    <Link to="/registro" state={{ desde: '/carrito' }}>crear una cuenta</Link>.
                </p>
            )}

            <div className="acciones-carrito">
                <button type="button" className="boton-carrito" onClick={vaciar} disabled={enviando}>
                    Vaciar carrito
                </button>
                <Link to="/productos" className="boton-carrito">
                    Seguir comprando
                </Link>
                <button
                    type="button"
                    className="boton-carrito"
                    onClick={handleFinalizarCompra}
                    disabled={enviando}
                >
                    {enviando ? 'Procesando…' : 'Efectuar compra'}
                </button>
            </div>
        </section>
    );
}
