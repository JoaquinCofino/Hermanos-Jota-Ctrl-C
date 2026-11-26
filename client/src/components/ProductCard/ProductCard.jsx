import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from '../BrandLogo/BrandLogo';
import Button from '../Button/Button';
import { useCart } from '../../context/CartContext';
import { formatearPrecio } from '../../utils/formatearPrecio';
import { rutaImagen } from '../../services/api';
import './ProductCard.css';

export default function ProductCard({ producto }) {
    const { agregar } = useCart();
    const [errorImg, setErrorImg] = useState(false);
    const [recienAgregado, setRecienAgregado] = useState(false);

    useEffect(() => {
        if (!recienAgregado) return;
        const timer = setTimeout(() => setRecienAgregado(false), 1800);
        return () => clearTimeout(timer);
    }, [recienAgregado]);

    const imagenCruda = producto.imagenUrl ?? producto.imagen;
    const imagenSrc = imagenCruda ? rutaImagen(imagenCruda) : null;

    const categoriaNombre =
        typeof producto.categoria === 'object'
            ? producto.categoria?.nombre
            : producto.categoria;

    const sinStock = typeof producto.stock === 'number' && producto.stock <= 0;
    const productoId = producto._id ?? producto.id;

    const handleAgregar = () => {
        if (sinStock) return;
        agregar(producto);
        setRecienAgregado(true);
    };

    return (
        <article className="product-card">
            <Link
                className="product-card__link"
                to={`/productos/${productoId}`}
            >
                <div className="product-card__media">
                    {!imagenSrc || errorImg ? (
                        <div className="product-card__fallback" aria-hidden="true">
                            <BrandLogo variant="suave" width={64} decorative />
                        </div>
                    ) : (
                        <img
                            className="product-card__img"
                            src={imagenSrc}
                            alt={producto.nombre}
                            loading="lazy"
                            onError={() => setErrorImg(true)}
                        />
                    )}

                    {sinStock ? (
                        <span className="product-card__badge product-card__badge--agotado">
                            Sin stock
                        </span>
                    ) : producto.destacado ? (
                        <span className="product-card__badge product-card__badge--destacado">
                            Destacado
                        </span>
                    ) : null}
                </div>

                <div className="product-card__info">
                    <p className="product-card__categoria">
                        {categoriaNombre || 'Sin categoría'}
                    </p>

                    <h3 className="product-card__nombre">
                        {producto.nombre}
                    </h3>

                    <p className="product-card__precio">
                        {formatearPrecio(producto.precio)}
                    </p>
                </div>
            </Link>

            <div className="product-card__pie">
                <Button
                    variant={recienAgregado ? 'secondary' : 'primary'}
                    size="sm"
                    fullWidth
                    disabled={sinStock}
                    onClick={handleAgregar}
                    aria-label={
                        sinStock
                            ? `${producto.nombre} sin stock`
                            : `Agregar ${producto.nombre} al carrito`
                    }
                >
                    {sinStock
                        ? 'Sin stock'
                        : recienAgregado
                          ? 'Agregado ✓'
                          : 'Agregar al carrito'}
                </Button>
            </div>
        </article>
    );
}
