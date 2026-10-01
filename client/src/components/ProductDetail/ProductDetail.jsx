import { useState, useEffect, Fragment } from 'react';
import './ProductDetail.css';

export default function ProductDetail({ producto, onVolver, onAgregarAlCarrito }) {
    const [mensajeExito, setMensajeExito] = useState(false);

    useEffect(() => {
        if (!mensajeExito) return;
        const timer = setTimeout(() => {
            setMensajeExito(false);
        }, 2500);
        return () => clearTimeout(timer);
    }, [mensajeExito]);

    if (!producto) return null;

    const handleAgregar = () => {
        onAgregarAlCarrito?.(producto);
        setMensajeExito(true);
    };

    const precioFormateado = new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        maximumFractionDigits: 0
    }).format(producto.precio);

    const f = producto.fabricacion;

    return (
        <article className="detalle-producto">
            <img
                className="detalle-producto__img"
                src={producto.imagen}
                alt={producto.nombre}
            />

            <div className="detalle-producto__info">
                <p className="tarjeta-producto__categoria">{producto.categoria}</p>
                <h1>{producto.nombre}</h1>

                <div className="detalle-producto__compra">
                    <p className="detalle-producto__precio">{precioFormateado}</p>
                    <button
                        type="button"
                        data-boton-agregar
                        onClick={handleAgregar}
                    >
                        Añadir al carrito
                    </button>
                </div>

                {mensajeExito && (
                    <p className="mensaje-exito">Se agregó al carrito ✓</p>
                )}

                <p className="detalle-producto__descripcion">{producto.descripcion}</p>
            </div>

            {f && f.length > 0 && (
                <section className="detalle-fabricacion">
                    <h2>Detalles de fabricación</h2>
                    <dl>
                        {f.map((item) => (
                            <Fragment key={item.label}>
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
