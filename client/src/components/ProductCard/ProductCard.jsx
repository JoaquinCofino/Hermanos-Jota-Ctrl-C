import { Link } from 'react-router-dom';
import { formatearPrecio } from '../../utils/formatearPrecio';
import './ProductCard.css';

export default function ProductCard({ producto }) {
    const imagenSrc =
        producto.imagenUrl?.startsWith('http') || producto.imagenUrl?.startsWith('/')
            ? producto.imagenUrl
            : `/${producto.imagenUrl}`;

    return (
        <article className="product-card">
            <Link className="product-card__link" to={`/productos/${producto._id}`}>
                <img
                    className="product-card__img"
                    src={imagenSrc}
                    alt={producto.nombre}
                    loading="lazy"
                />
                <div className="product-card__info">
                    <p className="product-card__categoria">{producto.categoria}</p>
                    <h3 className="product-card__nombre">{producto.nombre}</h3>
                    <p className="product-card__precio">{formatearPrecio(producto.precio)}</p>
                </div>
            </Link>
        </article>
    );
}