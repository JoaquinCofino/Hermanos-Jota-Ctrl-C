import ProductCard from '../ProductCard/ProductCard';
import './ProductList.css';

export default function ProductList({ productos, onSeleccionar }) {
    if (productos.length === 0) {
        return <p className="product-list__vacio">No hay productos para mostrar.</p>;
    }

    return (
        <div className="product-list">
            {productos.map((producto) => (
                <ProductCard
                    key={producto.id}
                    producto={producto}
                    onSeleccionar={onSeleccionar}
                />
            ))}
        </div>
    );
}
