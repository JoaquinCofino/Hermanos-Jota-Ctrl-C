import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/Button/Button';
import ProductForm from '../../components/ProductForm/ProductForm';
import { actualizarProducto } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './AdminProducto.css';

// Página de /admin/editar-producto/:id
export default function EditarProducto({
    productos,
    categorias,
    onActualizado
}) {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();

    const producto = productos.find((p) => p.id === id);

    if (!producto) {
        return (
            <div className="estado">
                <p>Producto no encontrado.</p>

                <Button to="/productos" variant="secondary" arrow="left">
                    Ver el catálogo
                </Button>
            </div>
        );
    }

    const handleSubmit = async (datos) => {
        const actualizado = await actualizarProducto(producto.id, datos, token);

        onActualizado(actualizado);

        navigate(`/productos/${actualizado.id}`, {
            state: { aviso: 'Los cambios se guardaron.' }
        });
    };

    return (
        <section className="admin-producto">
            <Button to={`/productos/${producto.id}`} variant="ghost" size="sm" arrow="left">
                Volver al producto
            </Button>

            <header className="seccion-encabezado">
                <h1>Editar producto</h1>
                <p className="seccion-subtitulo">{producto.nombre}</p>
            </header>

            <ProductForm
                key={producto.id}
                producto={producto}
                categorias={categorias}
                textoBoton="Guardar cambios"
                onSubmit={handleSubmit}
                onCancelar={() => navigate(`/productos/${producto.id}`)}
            />
        </section>
    );
}