import { urlImagen } from '../../services/api';
import { formatearPrecio } from '../../utils/formatearPrecio';
import './ProductDetail.css';

export default function ProductDetail({ producto, onVolver, onAgregarAlCarrito }) {
    return (
        <article className="product-detail">
            <button type="button" className="product-detail__volver" onClick={onVolver}>
                ← Volver al catálogo
            </button>

            <div className="product-detail__grid">
                <img
                    className="product-detail__img"
                    src={urlImagen(producto.imagen)}
                    alt={producto.nombre}
                />

                <div className="product-detail__info">
                    <p className="product-detail__categoria">{producto.categoria}</p>
                    <h1>{producto.nombre}</h1>
                    <p className="product-detail__precio">{formatearPrecio(producto.precio)}</p>

                    <button
                        type="button"
                        className="product-detail__agregar"
                        onClick={() => onAgregarAlCarrito?.(producto)}
                    >
                        Añadir al carrito
                    </button>

                    <p className="product-detail__descripcion">{producto.descripcion}</p>

                    <dl className="product-detail__specs">
                        {producto.medidas && (
                            <>
                                <dt>Medidas</dt>
                                <dd>{producto.medidas}</dd>
                            </>
                        )}
                        {producto.materiales && (
                            <>
                                <dt>Materiales</dt>
                                <dd>{producto.materiales}</dd>
                            </>
                        )}
                    </dl>
                </div>
            </div>

            {producto.fabricacion?.length > 0 && (
                <section className="product-detail__fabricacion">
                    <h2>Detalles de fabricación</h2>
                    <dl className="product-detail__specs">
                        {producto.fabricacion.map((item) => (
                            <div key={item.label}>
                                <dt>{item.label}</dt>
                                <dd>{item.value}</dd>
                            </div>
                        ))}
                    </dl>
                </section>
            )}
        </article>
    );
}
