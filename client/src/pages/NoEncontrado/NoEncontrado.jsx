import { Link } from 'react-router-dom';

export default function NoEncontrado() {
    return (
        <section className="estado">
            <h1>Página no encontrada</h1>
            <p>La dirección que buscás no existe.</p>
            <Link className="boton-volver" to="/">
                Volver al inicio
            </Link>
        </section>
    );
}
