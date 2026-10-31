import { Link } from 'react-router-dom';
import { formatearPrecio } from '../../utils/formatearPrecio';
import { rutaImagen } from '../../services/api';
import './ProductCard.css';

export default function ProductCard({ producto }) {
    const imagenSrc = rutaImagen(
        producto.imagenUrl ?? producto.imagen
    );

    return (
        <article className="product-card">
            <Link
                className="product-card__link"
                to={`/productos/${producto._id ?? producto.id}`}
            >
                <img
                    className="product-card__img"
                    src={imagenSrc}
                    alt={producto.nombre}
                    loading="lazy"
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = rutaImagen();
                    }}
                />

                <div className="product-card__info">
                    <p className="product-card__categoria">
                        {producto.categoria}
                    </p>

                    <h3 className="product-card__nombre">
                        {producto.nombre}
                    </h3>

                    <p className="product-card__precio">
                        {formatearPrecio(producto.precio)}
                    </p>
                </div>
            </Link>
        </article>
    );
}