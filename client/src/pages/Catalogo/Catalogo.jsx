import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Catalogo.css';
import '../AdminProducto/AdminProducto.css';

// Minúsculas y sin tildes.
function normalizar(texto = '') {
    return String(texto)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

// Comprueba si el término coincide con algún campo del producto.
function coincide(producto, termino) {
    const categoria = typeof producto.categoria === 'object'
        ? producto.categoria?.nombre
        : producto.categoria;

    const campos = [
        producto.nombre,
        categoria,
        producto.descripcion,
        ...(producto.fabricacion || []).map((item) => item.value)
    ];

    return campos.some((campo) =>
        normalizar(campo).includes(termino)
    );
}

export default function Catalogo({ productos, renderProductos }) {
    const [busqueda, setBusqueda] = useState('');

    const termino = normalizar(busqueda.trim());

    const filtrados = termino
        ? productos.filter((p) => coincide(p, termino))
        : productos;

    return (
        <section>
            <header className="seccion-encabezado catalogo-encabezado">
                <h1>Catálogo</h1>

                <p className="seccion-subtitulo catalogo-subtitulo">
                    Redescubrí el arte de vivir con piezas pensadas para perdurar.
                </p>

                <div className="buscador">
                    <input
                        type="search"
                        placeholder="Buscar por nombre, material o estilo..."
                        aria-label="Buscar productos"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>

                <Link
                    className="admin-boton catalogo-nuevo"
                    to="/admin/crear-producto"
                >
                    + Nuevo producto
                </Link>
            </header>

            {renderProductos(filtrados)}
        </section>
    );
}