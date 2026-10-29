import { useNavigate } from 'react-router-dom';
import ProductForm from '../../components/ProductForm/ProductForm';
import { crearProducto } from '../../services/api';
import './AdminProducto.css';

// Página de /admin/crear-producto
export default function CrearProducto({ categorias, onCreado }) {
    const navigate = useNavigate();

    const handleSubmit = async (datos) => {
        const nuevo = await crearProducto(datos);
        onCreado(nuevo);
        // Navegación programática: después de crear, se va al detalle del producto nuevo
        navigate(`/productos/${nuevo.id}`, { state: { aviso: `Se creó "${nuevo.nombre}".` } });
    };

    return (
        <section className="admin-producto">
            <header className="seccion-encabezado">
                <h1>Nuevo producto</h1>
                <p className="seccion-subtitulo">Completá los datos para sumar una pieza al catálogo.</p>
            </header>

            <ProductForm
                categorias={categorias}
                textoBoton="Crear producto"
                onSubmit={handleSubmit}
                onCancelar={() => navigate(-1)}
            />
        </section>
    );
}
