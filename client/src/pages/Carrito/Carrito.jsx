import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatearPrecio } from '../../utils/formatearPrecio';
import './Carrito.css';

export default function Carrito() {
    const { carrito, agregar, restar, quitar, vaciar, total } = useCart();
    const [compraRealizada, setCompraRealizada] = useState(false);

    const handleFinalizarCompra = () => {
        alert('¡Gracias por tu compra en Hermanos Jota! Tu pedido ha sido procesado.');
        vaciar();
        setCompraRealizada(true);
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
                        <>¡Muchas gracias por elegirnos! <Link to="/productos">Seguir explorando el catalogo →</Link> </>
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

            <div className="acciones-carrito">
                <button type="button" className="boton-carrito" onClick={vaciar}>
                    Vaciar carrito
                </button>
                <Link to="/productos" className="boton-carrito">
                    Seguir comprando
                </Link>
                <button type="button" className="boton-carrito" onClick={handleFinalizarCompra}>
                    Efectuar compra
                </button>
            </div>
        </section>
    );
}
