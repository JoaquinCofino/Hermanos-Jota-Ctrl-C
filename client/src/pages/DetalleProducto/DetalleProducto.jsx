import { Link, useParams } from 'react-router-dom';
import ProductDetail from '../../components/ProductDetail/ProductDetail';

// Página de /productos/:id — toma el id de la URL y busca el producto en la lista ya cargada.
export default function DetalleProducto({ productos, onAgregarAlCarrito }) {
    const { id } = useParams();
    const producto = productos.find((p) => p.id === id);

    if (!producto) {
        return (
            <div className="estado">
                <p>Producto no encontrado.</p>
                <Link className="boton-volver" to="/productos">
                    Ver el catálogo
                </Link>
            </div>
        );
    }

    return (
        <>
            <Link className="boton-volver" to="/productos">
                ← Volver al catálogo
            </Link>
            <ProductDetail producto={producto} onAgregarAlCarrito={onAgregarAlCarrito} />
        </>
    );
}
