import { Link, useNavigate, useParams } from 'react-router-dom';
import ProductForm from '../../components/ProductForm/ProductForm';
import { actualizarProducto } from '../../services/api';
import './AdminProducto.css';

// Página de /admin/editar-producto/:id — carga el producto de la lista y lo edita con el mismo form
export default function EditarProducto({ productos, categorias, onActualizado }) {
    const { id } = useParams();
    const navigate = useNavigate();
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

    const handleSubmit = async (datos) => {
        const actualizado = await actualizarProducto(producto.id, datos);
        onActualizado(actualizado);
        navigate(`/productos/${actualizado.id}`, { state: { aviso: 'Los cambios se guardaron.' } });
    };

    return (
        <section className="admin-producto">
            <Link className="boton-volver" to={`/productos/${producto.id}`}>
                ← Volver al producto
            </Link>

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
