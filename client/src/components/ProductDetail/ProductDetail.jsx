import { useState, useEffect, useMemo, Fragment } from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from '../BrandLogo/BrandLogo';
import Button from '../Button/Button';
import ProductCard from '../ProductCard/ProductCard';
import { rutaImagen } from '../../services/api';
import { formatearPrecio } from '../../utils/formatearPrecio';
import { useCart } from '../../context/CartContext';
import './ProductDetail.css';

export default function ProductDetail({ producto, productos = [] }) {
    const { carrito, agregar, restar } = useCart();
    const [mensajeExito, setMensajeExito] = useState(false);
    const [indiceActivo, setIndiceActivo] = useState(0);
    const [errorImagen, setErrorImagen] = useState(false);

    const productoId = producto?.id ?? producto?._id;

    // Resetear galería al cambiar de producto
    useEffect(() => {
        setIndiceActivo(0);
        setErrorImagen(false);
    }, [productoId]);

    useEffect(() => {
        if (!mensajeExito) return;

        const timer = setTimeout(() => {
            setMensajeExito(false);
        }, 2500);

        return () => clearTimeout(timer);
    }, [mensajeExito]);

    // Construye galería con las imágenes reales disponibles (sin inventar fotos extra)
    const imagenes = useMemo(() => {
        if (!producto) return [];
        if (Array.isArray(producto.imagenes) && producto.imagenes.length > 0) {
            return producto.imagenes.map((img) => rutaImagen(img));
        }
        const unica = producto.imagenUrl ?? producto.imagen;
        return unica ? [rutaImagen(unica)] : [];
    }, [producto]);

    const categoriaId =
        typeof producto?.categoria === 'object'
            ? producto.categoria?._id ?? producto.categoria?.id
            : producto?.categoria;

    const categoriaNombre =
        typeof producto?.categoria === 'object'
            ? producto.categoria?.nombre
            : producto?.categoria;

    // Productos relacionados de la misma categoría (solo si hay datos disponibles)
    const relacionados = useMemo(() => {
        if (!producto || !categoriaId || !Array.isArray(productos)) return [];
        return productos
            .filter((p) => {
                const pId = p.id ?? p._id;
                if (String(pId) === String(productoId)) return false;
                const pCat =
                    typeof p.categoria === 'object'
                        ? p.categoria?._id ?? p.categoria?.id
                        : p.categoria;
                return String(pCat) === String(categoriaId);
            })
            .slice(0, 3);
    }, [producto, productoId, categoriaId, productos]);

    if (!producto) return null;

    const cantidad = carrito.find((item) => item.id === producto.id)?.cantidad || 0;
    const sinStock = typeof producto.stock === 'number' && producto.stock <= 0;
    const imagenActual = imagenes[indiceActivo] || null;
    const fabricacion = Array.isArray(producto.fabricacion) ? producto.fabricacion : [];
    const precioFormateado = formatearPrecio(producto.precio);

    const handleAgregar = () => {
        if (sinStock) return;
        agregar(producto);
        setMensajeExito(true);
    };

    const handleSumar = () => {
        if (sinStock) return;
        agregar(producto);
    };

    const handleRestar = () => {
        if (cantidad > 0) {
            restar(producto.id);
        }
    };

    const seleccionarImagen = (indice) => {
        if (indice === indiceActivo) return;
        setIndiceActivo(indice);
        setErrorImagen(false);
    };

    return (
        <div className="detalle-pagina">
            <nav className="detalle-breadcrumbs" aria-label="Ruta de navegación">
                <ol>
                    <li>
                        <Link to="/">Inicio</Link>
                    </li>
                    <li>
                        <Link to="/productos">Catálogo</Link>
                    </li>
                    <li aria-current="page">{producto.nombre}</li>
                </ol>
            </nav>

            <article className="detalle-producto">
                <div className="detalle-galeria">
                    <div className="detalle-galeria__principal">
                        {!imagenActual || errorImagen ? (
                            <div className="detalle-galeria__fallback" aria-hidden="true">
                                <BrandLogo variant="suave" width={96} decorative />
                            </div>
                        ) : (
                            <img
                                key={imagenActual}
                                className="detalle-producto__img"
                                src={imagenActual}
                                alt={producto.nombre}
                                onError={() => setErrorImagen(true)}
                            />
                        )}
                    </div>

                    {imagenes.length > 1 && (
                        <div
                            className="detalle-galeria__miniaturas"
                            role="list"
                            aria-label="Vistas del producto"
                        >
                            {imagenes.map((src, idx) => (
                                <button
                                    key={`${src}-${idx}`}
                                    type="button"
                                    className={`detalle-galeria__thumb ${
                                        idx === indiceActivo ? 'detalle-galeria__thumb--activa' : ''
                                    }`}
                                    onClick={() => seleccionarImagen(idx)}
                                    aria-label={`Ver imagen ${idx + 1} de ${producto.nombre}`}
                                    aria-pressed={idx === indiceActivo}
                                >
                                    <img src={src} alt="" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="detalle-producto__info">
                    <p className="detalle-producto__categoria">
                        {categoriaNombre || 'Sin categoría'}
                    </p>

                    <h1 className="detalle-producto__titulo">{producto.nombre}</h1>

                    <div className="detalle-producto__compra">
                        <p className="detalle-producto__precio">{precioFormateado}</p>

                        {sinStock && (
                            <span className="detalle-producto__badge-stock">Sin stock</span>
                        )}
                    </div>

                    <div className="detalle-producto__controles">
                        {cantidad > 0 && (
                            <div
                                className="detalle-producto__contador"
                                aria-label="Cantidad en el carrito"
                            >
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
                                    disabled={sinStock}
                                >
                                    +
                                </button>
                            </div>
                        )}

                        <Button
                            variant="primary"
                            onClick={handleAgregar}
                            disabled={sinStock}
                            data-boton-agregar
                            className="detalle-producto__cta"
                        >
                            {sinStock ? 'Sin stock' : 'Agregar al carrito'}
                        </Button>
                    </div>

                    {mensajeExito && (
                        <p
                            className="detalle-producto__exito"
                            role="status"
                            aria-live="polite"
                        >
                            Pieza sumada al carrito ✓
                        </p>
                    )}

                    {/* Secciones colapsables */}
                    <div className="detalle-acordeones">
                        {producto.descripcion && (
                            <details className="detalle-acordeon" open>
                                <summary className="detalle-acordeon__resumen">
                                    Descripción
                                </summary>
                                <div className="detalle-acordeon__contenido">
                                    <p className="detalle-producto__descripcion">
                                        {producto.descripcion}
                                    </p>
                                </div>
                            </details>
                        )}

                        {fabricacion.length > 0 && (
                            <details className="detalle-acordeon">
                                <summary className="detalle-acordeon__resumen">
                                    Detalles de fabricación
                                </summary>
                                <div className="detalle-acordeon__contenido">
                                    <dl className="detalle-fabricacion__lista">
                                        {fabricacion.map((item, indice) => (
                                            <Fragment key={`${item.label}-${indice}`}>
                                                <dt>{item.label}</dt>
                                                <dd>{item.value}</dd>
                                            </Fragment>
                                        ))}
                                    </dl>
                                </div>
                            </details>
                        )}
                    </div>
                </div>
            </article>

            {relacionados.length > 0 && (
                <section className="detalle-relacionados" aria-labelledby="titulo-relacionados">
                    <h2 id="titulo-relacionados" className="detalle-relacionados__titulo">
                        También te puede interesar
                    </h2>
                    <div className="detalle-relacionados__grid">
                        {relacionados.map((rel) => (
                            <ProductCard key={rel.id ?? rel._id} producto={rel} />
                        ))}
                    </div>
                </section>
            )}

            {/* Barra fija inferior en mobile (< 768px) */}
            <div className="detalle-barra-fija" aria-label="Compra rápida">
                <div className="detalle-barra-fija__precio">
                    <span className="detalle-barra-fija__label">Precio</span>
                    <strong>{precioFormateado}</strong>
                </div>
                <Button
                    variant="primary"
                    size="sm"
                    onClick={handleAgregar}
                    disabled={sinStock}
                >
                    {sinStock ? 'Sin stock' : 'Agregar al carrito'}
                </Button>
            </div>
        </div>
    );
}
