import { useState, useEffect, Fragment } from 'react';
import { rutaImagen } from '../../services/api';
import { useCart } from '../../context/CartContext';
import './ProductDetail.css';

export default function ProductDetail({ producto }) {
    const { carrito, agregar, restar } = useCart();
    const [mensajeExito, setMensajeExito] = useState(false);

    useEffect(() => {
        if (!mensajeExito) return;

        const timer = setTimeout(() => {
            setMensajeExito(false);
        }, 2500);

        return () => clearTimeout(timer);
    }, [mensajeExito]);

    if (!producto) return null;

    const cantidad = carrito.find((item) => item.id === producto.id)?.cantidad || 0;

    const handleAgregar = () => {
        agregar(producto);
        setMensajeExito(true);
    };

    const handleSumar = () => {
        agregar(producto);
    };

    const handleRestar = () => {
        if (cantidad > 0) {
            restar(producto.id);
        }
    };

    const precioFormateado = new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        maximumFractionDigits: 0
    }).format(producto.precio);

    const fabricacion = producto.fabricacion || [];

    const categoriaNombre =
        typeof producto.categoria === 'object'
            ? producto.categoria?.nombre
            : producto.categoria;

    const imagenSrc = rutaImagen(
        producto.imagenUrl ?? producto.imagen
    );

    return (
        <article className="detalle-producto">
            <img
                className="detalle-producto__img"
                src={imagenSrc}
                alt={producto.nombre}
                onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = rutaImagen();
                }}
            />

            <div className="detalle-producto__info">
                <p className="tarjeta-producto__categoria">
                    {categoriaNombre || 'Sin categoría'}
                </p>

                <h1>{producto.nombre}</h1>

                <div className="detalle-producto__compra">
                    <p className="detalle-producto__precio">
                        {precioFormateado}
                    </p>

                    {cantidad > 0 && (
                        <div className="detalle-producto__contador">
                            <button
                                type="button"
                                className="detalle-producto__contador-btn"
                                aria-label="Restar una unidad"
                                onClick={handleRestar}
                            >
                                −
                            </button>

                            <span className="detalle-producto__contador-valor">
                                {cantidad}
                            </span>

                            <button
                                type="button"
                                className="detalle-producto__contador-btn"
                                aria-label="Sumar una unidad"
                                onClick={handleSumar}
                            >
                                +
                            </button>
                        </div>
                    )}
                </div>

                <div className="detalle-producto__acciones">
                    <button
                        type="button"
                        data-boton-agregar
                        onClick={handleAgregar}
                    >
                        Añadir al carrito
                    </button>

                    {mensajeExito && (
                        <span
                            className="mensaje-exito"
                            role="status"
                            aria-live="polite"
                        >
                            Se agregó al carrito ✓
                        </span>
                    )}
                </div>

                <p className="detalle-producto__descripcion">
                    {producto.descripcion}
                </p>
            </div>

            {fabricacion.length > 0 && (
                <section className="detalle-fabricacion">
                    <h2>Detalles de fabricación</h2>

                    <dl>
                        {fabricacion.map((item, indice) => (
                            <Fragment key={`${item.label}-${indice}`}>
                                <dt>{item.label}</dt>
                                <dd>{item.value}</dd>
                            </Fragment>
                        ))}
                    </dl>
                </section>
            )}
        </article>
    );
}
