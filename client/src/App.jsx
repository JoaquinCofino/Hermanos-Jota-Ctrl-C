import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import ProductList from './components/ProductList/ProductList';
import ContactForm from './components/ContactForm/ContactForm';
import Footer from './components/Footer/Footer';
import EstadoPeticion from './components/EstadoPeticion/EstadoPeticion';
import DetalleProducto from './pages/DetalleProducto/DetalleProducto';
import Carrito from './pages/Carrito/Carrito';
import NoEncontrado from './pages/NoEncontrado/NoEncontrado';
import { obtenerProductos } from './services/api';
import './App.css';
import './index.css';

// El carrito se guarda en localStorage para que no se pierda al recargar la página
const CARRITO_KEY = 'hj_carrito';

function leerCarritoGuardado() {
    try {
        return JSON.parse(localStorage.getItem(CARRITO_KEY)) || [];
    } catch {
        return [];
    }
}

function App() {
    // Ciclo de vida de la petición: cargando → éxito (productos) | error
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [intento, setIntento] = useState(0);

    // Array de ids de producto: cada id repetido es una unidad más
    const [carrito, setCarrito] = useState(leerCarritoGuardado);

    const { pathname } = useLocation();

    useEffect(() => {
        try {
            localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
        } catch {
            // Si el navegador bloquea localStorage, el carrito sigue funcionando en memoria
        }
    }, [carrito]);

    const sumarUnidad = (id) => {
        setCarrito((prev) => [...prev, id]);
    };

    const restarUnidad = (id) => {
        setCarrito((prev) => {
            const indice = prev.indexOf(id);
            return indice === -1 ? prev : [...prev.slice(0, indice), ...prev.slice(indice + 1)];
        });
    };

    const quitarProducto = (id) => {
        setCarrito((prev) => prev.filter((idCarrito) => idCarrito !== id));
    };

    const vaciarCarrito = () => {
        setCarrito([]);
    };

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

    // Al cambiar de página, volver arriba (como en una navegación normal)
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

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
                <>
                    <button
                        type="button"
                        className="boton-volver"
                        onClick={() => setProductoSeleccionadoId(null)}
                    >
                        ← Volver al catálogo
                    </button>
                    <ProductDetail
                        producto={productoSeleccionado}
                        onVolver={() => setProductoSeleccionadoId(null)}
                        onAgregarAlCarrito={agregarAlCarrito}
                    />
                </>
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
            return (
                <section>
                    <h1>Contacto</h1>
                    <ContactForm />
                </section>
            );
        }

        return (
            <>
                <section className="hero">
                    <h1>Muebles que alimentan el alma</h1>
                    <p>
                        En Hermanos Jota, somos fieles creyentes de que 
                        las piezas nacen de la tradición y encuentran su lugar en el presente, tanto en la historia como en la necesidad de cada hogar. Creamos piezas que honran la tradición, los materiales nobles y el trabajo artesanal, pensando en el presente y en un futuro más consciente.
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
            <Navbar vistaActual={vista} onNavegar={handleNavegar} cantidadCarrito={carrito.length} />
            <main className="contenedor">{renderVista()}</main>
            <Footer />
        </>
    );
}

export default App;
