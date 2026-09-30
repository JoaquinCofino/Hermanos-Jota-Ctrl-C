import { useEffect, useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import ProductList from './components/ProductList/ProductList';
import ProductDetail from './components/ProductDetail/ProductDetail';
import { obtenerProductos } from './services/api';
import './App.css';

function App() {
    // Ciclo de vida de la petición: cargando → éxito (productos) | error
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [intento, setIntento] = useState(0);

    const [vista, setVista] = useState('inicio');
    const [productoSeleccionadoId, setProductoSeleccionadoId] = useState(null);

    // TODO (FT): estado del carrito acá. Conectar con:
    //   <Navbar cantidadCarrito={...} />  y  <ProductDetail onAgregarAlCarrito={...} />

    useEffect(() => {
        // Cancela el fetch si el componente se desmonta (o StrictMode ejecuta el efecto dos veces)
        const controller = new AbortController();

        setCargando(true);
        setError(null);

        obtenerProductos(controller.signal)
            .then((data) => setProductos(data))
            .catch((err) => {
                if (err.name === 'AbortError') return;
                setError('No pudimos cargar los productos. Verificá que el servidor esté corriendo.');
                console.error(err);
            })
            .finally(() => {
                if (!controller.signal.aborted) setCargando(false);
            });

        return () => controller.abort();
    }, [intento]);

    const productoSeleccionado = productos.find((p) => p.id === productoSeleccionadoId);

    const handleNavegar = (nuevaVista) => {
        setVista(nuevaVista);
        setProductoSeleccionadoId(null);
    };

    const handleSeleccionar = (id) => {
        setProductoSeleccionadoId(id);
        window.scrollTo(0, 0);
    };

    const renderProductos = (lista) => {
        if (cargando) {
            return <p className="estado">Cargando productos…</p>;
        }

        if (error) {
            return (
                <div className="estado estado--error">
                    <p>{error}</p>
                    <button type="button" onClick={() => setIntento((n) => n + 1)}>
                        Reintentar
                    </button>
                </div>
            );
        }

        return <ProductList productos={lista} onSeleccionar={handleSeleccionar} />;
    };

    const renderVista = () => {
        if (productoSeleccionado) {
            return (
                <ProductDetail
                    producto={productoSeleccionado}
                    onVolver={() => setProductoSeleccionadoId(null)}
                />
            );
        }

        if (vista === 'catalogo') {
            return (
                <section>
                    <h1>Catálogo</h1>
                    {renderProductos(productos)}
                </section>
            );
        }

        if (vista === 'contacto') {
            // TODO: reemplazar por <ContactForm /> cuando se mergee feature/contact-form
            return (
                <section>
                    <h1>Contacto</h1>
                </section>
            );
        }

        return (
            <>
                <section className="hero">
                    <h1>Muebles que alimentan el alma</h1>
                    <p>
                        Piezas que honran la tradición, los materiales nobles y el trabajo
                        artesanal, pensadas para el presente y un futuro más consciente.
                    </p>
                </section>
                <section>
                    <h2>Destacados</h2>
                    {renderProductos(productos.filter((p) => p.destacado))}
                </section>
            </>
        );
    };

    return (
        <>
            <Navbar vistaActual={vista} onNavegar={handleNavegar} />
            <main className="contenedor">{renderVista()}</main>
        </>
    );
}

export default App;
