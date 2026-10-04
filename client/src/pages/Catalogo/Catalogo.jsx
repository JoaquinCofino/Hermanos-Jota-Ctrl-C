import { useState } from 'react';
import './Catalogo.css';

// Minúsculas y sin tildes, para que "sofa" encuentre "Sofá"
function normalizar(texto = '') {
    return texto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function coincide(producto, termino) {
    const campos = [
        producto.nombre,
        producto.categoria,
        producto.descripcion,
        ...(producto.fabricacion || []).map((item) => item.value)
    ];
    return campos.some((campo) => normalizar(campo).includes(termino));
}

export default function Catalogo({ productos, renderProductos }) {
    const [busqueda, setBusqueda] = useState('');

    const termino = normalizar(busqueda.trim());
    const filtrados = termino ? productos.filter((p) => coincide(p, termino)) : productos;

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
            </header>

            {renderProductos(filtrados)}
        </section>
    );
}
