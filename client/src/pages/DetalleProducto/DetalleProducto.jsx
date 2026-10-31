import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ProductDetail from '../../components/ProductDetail/ProductDetail';
import { eliminarProducto } from '../../services/api';
import '../AdminProducto/AdminProducto.css';

// Página de /productos/:id — toma el id de la URL y busca el producto en la lista ya cargada.
export default function DetalleProducto({
    productos,
    carrito = [],
    onAgregarAlCarrito,
    onSumar,
    onRestar,
    onEliminado
}) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [confirmando, setConfirmando] = useState(false);
    const [eliminando, setEliminando] = useState(false);
    const [errorEliminar, setErrorEliminar] = useState(null);

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

    const cantidad = carrito.filter((itemId) => itemId === id).length;

    const handleEliminar = async () => {
        setEliminando(true);
        setErrorEliminar(null);
        try {
            await eliminarProducto(producto.id);
            // Primero se navega y después se saca de la lista, así no aparece "Producto no encontrado"
            navigate('/productos', { state: { aviso: `Se eliminó "${producto.nombre}".` } });
            onEliminado?.(producto.id);
        } catch (err) {
            setErrorEliminar(err.message || 'No se pudo eliminar el producto.');
            setEliminando(false);
            setConfirmando(false);
        }
    };

    return (
        <>
            <div className="admin-acciones">
                <Link className="boton-volver" to="/productos">
                    ← Volver al catálogo
                </Link>
                <div className="admin-acciones__botones">
                    <Link className="admin-boton" to={`/admin/editar-producto/${producto.id}`}>
                        Editar
                    </Link>
                    <button
                        type="button"
                        className="admin-boton admin-boton--peligro"
                        onClick={() => setConfirmando(true)}
                        disabled={eliminando}
                    >
                        Eliminar
                    </button>
                </div>
            </div>

            {confirmando && (
                <div className="admin-confirmacion" role="alert">
                    <p>
                        ¿Eliminar <strong>"{producto.nombre}"</strong>? Esta acción no se puede deshacer.
                    </p>
                    <div className="admin-acciones__botones">
                        <button
                            type="button"
                            className="admin-boton"
                            onClick={() => setConfirmando(false)}
                            disabled={eliminando}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            className="admin-boton admin-boton--confirmar-peligro"
                            onClick={handleEliminar}
                            disabled={eliminando}
                        >
                            {eliminando ? 'Eliminando…' : 'Sí, eliminar'}
                        </button>
                    </div>
                </div>
            )}

            {errorEliminar && (
                <p className="admin-error" role="alert">
                    {errorEliminar}
                </p>
            )}

            <ProductDetail
                producto={producto}
                cantidad={cantidad}
                onAgregarAlCarrito={onAgregarAlCarrito}
                onSumar={() => (onSumar ? onSumar(producto.id) : onAgregarAlCarrito?.(producto))}
                onRestar={() => onRestar?.(producto.id)}
            />
        </>
    );
}
