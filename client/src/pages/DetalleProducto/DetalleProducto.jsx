import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/Button/Button';
import ProductDetail from '../../components/ProductDetail/ProductDetail';
import { eliminarProducto } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import '../AdminProducto/AdminProducto.css';

// Página de /productos/:id — toma el id de la URL y busca el producto en la lista ya cargada.
export default function DetalleProducto({ productos, onEliminado }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token, usuario } = useAuth();
    const { quitar } = useCart();
    const [confirmando, setConfirmando] = useState(false);
    const [eliminando, setEliminando] = useState(false);
    const [errorEliminar, setErrorEliminar] = useState(null);

    const esAdmin = usuario?.rol === 'admin';

    const producto = productos.find((p) => p.id === id);

    if (!producto) {
        return (
            <div className="estado">
                <p>No encontramos la pieza que estás buscando.</p>
                <div style={{ marginTop: '1rem' }}>
                    <Button to="/productos" variant="primary" arrow="left">
                        Volver al catálogo
                    </Button>
                </div>
            </div>
        );
    }

    const handleEliminar = async () => {
        setEliminando(true);
        setErrorEliminar(null);
        try {
            await eliminarProducto(producto.id, token);
            quitar(producto.id);
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
                <Button to="/productos" variant="ghost" size="sm" arrow="left">
                    Volver al catálogo
                </Button>
                {esAdmin && (
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
                )}
            </div>

            {esAdmin && confirmando && (
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

            {esAdmin && errorEliminar && (
                <p className="admin-error" role="alert">
                    {errorEliminar}
                </p>
            )}

            <ProductDetail producto={producto} productos={productos} />
        </>
    );
}

