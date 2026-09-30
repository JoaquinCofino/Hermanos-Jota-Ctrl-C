import { urlImagen } from '../../services/api';
import { formatearPrecio } from '../../utils/formatearPrecio';
import './ProductCard.css';

export default function ProductCard({ producto, onSeleccionar }) {
    return (
        <article className="product-card">
            <button
                type="button"
                className="product-card__boton"
                onClick={() => onSeleccionar(producto.id)}
            >
                <img
                    className="product-card__img"
                    src={urlImagen(producto.imagen)}
                    alt={producto.nombre}
                    loading="lazy"
                />
                <div className="product-card__info">
                    <p className="product-card__categoria">{producto.categoria}</p>
                    <h3 className="product-card__nombre">{producto.nombre}</h3>
                    <p className="product-card__precio">{formatearPrecio(producto.precio)}</p>
                </div>
            </button>
        </article>
    );
}
