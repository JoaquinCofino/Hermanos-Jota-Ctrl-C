import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import ProductList from './components/ProductList/ProductList';
import ContactForm from './components/ContactForm/ContactForm';
import Footer from './components/Footer/Footer';
import EstadoPeticion from './components/EstadoPeticion/EstadoPeticion';
import Aviso from './components/Aviso/Aviso';

import Catalogo from './pages/Catalogo/Catalogo';
import DetalleProducto from './pages/DetalleProducto/DetalleProducto';
import Carrito from './pages/Carrito/Carrito';
import CrearProducto from './pages/AdminProducto/CrearProducto';
import EditarProducto from './pages/AdminProducto/EditarProducto';
import NoEncontrado from './pages/NoEncontrado/NoEncontrado';

import {
    obtenerProductos,
    obtenerCategorias
} from './services/api';

import './App.css';
import './index.css';

const CARRITO_KEY = 'hj_carrito';
const PRODUCTOS_KEY = 'hj_productos_v1';

function leerGuardado(clave) {
    try {
        return JSON.parse(localStorage.getItem(clave)) || [];
    } catch {
        return [];
    }
}

function guardar(clave, valor) {
    try {
        localStorage.setItem(clave, JSON.stringify(valor));
    } catch {
        // Si localStorage falla, la aplicación sigue funcionando en memoria.
    }
}

function App() {
    const [productos, setProductos] = useState(() => leerGuardado(PRODUCTOS_KEY));
    const [categorias, setCategorias] = useState([]);

    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [intento, setIntento] = useState(0);

    const [carrito, setCarrito] = useState(() => leerGuardado(CARRITO_KEY));

    const { pathname } = useLocation();

    // Guardar carrito.
    useEffect(() => {
        guardar(CARRITO_KEY, carrito);
    }, [carrito]);

    // Guardar productos.
    useEffect(() => {
        guardar(PRODUCTOS_KEY, productos);
    }, [productos]);

    // Cargar categorías desde su colección independiente.
    useEffect(() => {
        const controller = new AbortController();

        obtenerCategorias(controller.signal)
            .then((data) => {
                setCategorias(data);
            })
            .catch((err) => {
                if (err.name === 'AbortError') return;

                console.error('Error al cargar las categorías:', err);
            });

        return () => controller.abort();
    }, []);

    // Funciones del carrito.
    const sumarUnidad = (id) => {
        setCarrito((prev) => [...prev, id]);
    };

    const restarUnidad = (id) => {
        setCarrito((prev) => {
            const indice = prev.indexOf(id);

            return indice === -1
                ? prev
                : [...prev.slice(0, indice), ...prev.slice(indice + 1)];
        });
    };

    const quitarProducto = (id) => {
        setCarrito((prev) => prev.filter((idCarrito) => idCarrito !== id));
    };

    const vaciarCarrito = () => {
        setCarrito([]);
    };

    // CRUD de productos.
    const agregarProducto = (nuevo) => {
        setProductos((prev) => [...prev, nuevo]);
    };

    const reemplazarProducto = (actualizado) => {
        setProductos((prev) =>
            prev.map((p) => p.id === actualizado.id ? actualizado : p)
        );
    };

    const borrarProducto = (id) => {
        setProductos((prev) => prev.filter((p) => p.id !== id));
        quitarProducto(id);
    };

    // Cargar productos desde el backend.
    useEffect(() => {
        const controller = new AbortController();

        setCargando(true);
        setError(null);

        obtenerProductos(controller.signal)
            .then((data) => setProductos(data))
            .catch((err) => {
                if (err.name === 'AbortError') return;

                setError(
                    'No pudimos cargar los productos. Verificá que el servidor esté corriendo.'
                );

                console.error(err);
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setCargando(false);
                }
            });

        return () => controller.abort();
    }, [intento]);

    // Volver arriba al cambiar de página.
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    const sinProductos = productos.length === 0;

    const peticion = {
        cargando: cargando && sinProductos,
        error: sinProductos ? error : null,
        onReintentar: () => setIntento((n) => n + 1)
    };

    const renderProductos = (lista) => (
        <EstadoPeticion {...peticion}>
            <ProductList productos={lista} />
        </EstadoPeticion>
    );

    return (
        <>
            <Navbar cantidadCarrito={carrito.length} />

            <main className="contenedor">
                <Aviso key={pathname} />

                <Routes>
                    <Route
                        path="/"
                        element={
                            <>
                                <section className="hero">
                                    <div className="hero__contenido">
                                        <span className="hero__etiqueta">
                                            Casa Taller & Oficio
                                        </span>

                                        <h1>Muebles que alimentan el alma</h1>

                                        <p>
                                            En Hermanos Jota, somos fieles creyentes
                                            de que las piezas nacen de la tradición
                                            y encuentran su lugar en el presente,
                                            tanto en la historia como en la necesidad
                                            de cada hogar. Creamos piezas que honran
                                            la tradición, los materiales nobles y el
                                            trabajo artesanal, pensando en el presente
                                            y en un futuro más consciente.
                                        </p>
                                    </div>
                                </section>

                                <section>
                                    <header className="seccion-encabezado">
                                        <h2>Piezas Destacadas</h2>

                                        <p className="seccion-subtitulo">
                                            Una selección de piezas que combinan
                                            materiales nobles y trabajo consciente.
                                        </p>
                                    </header>

                                    {renderProductos(
                                        productos.filter((p) => p.destacado)
                                    )}
                                </section>
                            </>
                        }
                    />

                    <Route
                        path="/productos"
                        element={
                            <Catalogo
                                productos={productos}
                                renderProductos={renderProductos}
                            />
                        }
                    />

                    <Route
                        path="/productos/:id"
                        element={
                            <EstadoPeticion {...peticion}>
                                <DetalleProducto
                                    productos={productos}
                                    carrito={carrito}
                                    onAgregarAlCarrito={(producto) =>
                                        sumarUnidad(producto.id)
                                    }
                                    onSumar={sumarUnidad}
                                    onRestar={restarUnidad}
                                    onEliminado={borrarProducto}
                                />
                            </EstadoPeticion>
                        }
                    />

                    <Route
                        path="/admin/crear-producto"
                        element={
                            <CrearProducto
                                categorias={categorias}
                                onCreado={agregarProducto}
                            />
                        }
                    />

                    <Route
                        path="/admin/editar-producto/:id"
                        element={
                            <EstadoPeticion {...peticion}>
                                <EditarProducto
                                    productos={productos}
                                    categorias={categorias}
                                    onActualizado={reemplazarProducto}
                                />
                            </EstadoPeticion>
                        }
                    />

                    <Route
                        path="/carrito"
                        element={
                            <EstadoPeticion {...peticion}>
                                <Carrito
                                    carrito={carrito}
                                    productos={productos}
                                    onSumar={sumarUnidad}
                                    onRestar={restarUnidad}
                                    onQuitar={quitarProducto}
                                    onVaciar={vaciarCarrito}
                                />
                            </EstadoPeticion>
                        }
                    />

                    <Route
                        path="/contacto"
                        element={
                            <section>
                                <header className="seccion-encabezado">
                                    <h1>Contacto</h1>

                                    <p className="seccion-subtitulo">
                                        Escribinos para coordinar visitas a nuestra
                                        Casa Taller o iniciar un proyecto a medida.
                                    </p>
                                </header>

                                <ContactForm />
                            </section>
                        }
                    />

                    <Route path="*" element={<NoEncontrado />} />
                </Routes>
            </main>

            <Footer />
        </>
    );
}

export default App;
