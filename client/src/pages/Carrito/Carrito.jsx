import { Link } from 'react-router-dom';
import { formatearPrecio } from '../../utils/formatearPrecio';
import './Carrito.css';

// El carrito es un array de ids: cada id repetido es una unidad más de ese producto.
function agruparCarrito(idsCarrito, productos) {
    const cantidades = {};
    idsCarrito.forEach((id) => {
        cantidades[id] = (cantidades[id] || 0) + 1;
    });

    return Object.keys(cantidades)
        .map((id) => {
            const producto = productos.find((p) => p.id === id);
            return producto ? { producto, cantidad: cantidades[id] } : null;
        })
        .filter(Boolean);
}

export default function Carrito({ carrito, productos, onSumar, onRestar, onQuitar, onVaciar }) {
    const items = agruparCarrito(carrito, productos);
    const total = items.reduce((acc, { producto, cantidad }) => acc + producto.precio * cantidad, 0);

    if (items.length === 0) {
        return (
            <section>
                <h1>Tu carrito</h1>
                <p className="estado">
                    Tu carrito está vacío. <Link to="/productos">Ver catálogo →</Link>
                </p>
            </section>
        );
    }

    return (
        <section>
            <h1>Tu carrito</h1>

            {items.map(({ producto, cantidad }) => (
                <article key={producto.id} className="fila-carrito">
                    <img className="fila-carrito__img" src={producto.imagen} alt={producto.nombre} />
                    <div className="fila-carrito__info">
                        <h3>{producto.nombre}</h3>
                        <p className="categoria">{formatearPrecio(producto.precio)} c/u</p>
                    </div>
                    <div className="fila-carrito__cantidad">
                        <button type="button" aria-label="Quitar una unidad" onClick={() => onRestar(producto.id)}>
                            −
                        </button>
                        <span>{cantidad}</span>
                        <button type="button" aria-label="Agregar una unidad" onClick={() => onSumar(producto.id)}>
                            +
                        </button>
                    </div>
                    <p className="fila-carrito__subtotal">{formatearPrecio(producto.precio * cantidad)}</p>
                    <button
                        type="button"
                        className="fila-carrito__quitar"
                        aria-label="Quitar producto"
                        onClick={() => onQuitar(producto.id)}
                    >
                        ✕
                    </button>
                </article>
            ))}

            <div className="resumen-carrito">
                <span>Total</span>
                <span>{formatearPrecio(total)}</span>
            </div>

            <div className="acciones-carrito">
                <button type="button" className="boton-carrito" onClick={onVaciar}>
                    Vaciar carrito
                </button>
                <Link to="/productos" className="boton-carrito">
                    Seguir comprando
                </Link>
            </div>
        </section>
    );
}
