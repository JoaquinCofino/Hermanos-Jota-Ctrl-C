import { Link } from 'react-router-dom';
import Button from '../../components/Button/Button';
import './NoEncontrado.css';

export default function NoEncontrado({
    codigo = '404',
    titulo = 'Página no encontrada',
    descripcion = 'La página que buscás no existe o cambió de dirección. Podés volver al inicio o seguir recorriendo el sitio.',
    accionPrimaria = { to: '/', texto: 'Ir al inicio' },
    accionSecundaria = { to: '/productos', texto: 'Ver catálogo', arrow: 'right' },
    ayudaTexto = '¿Necesitás ayuda?',
    ayudaEnlace = { to: '/contacto', texto: 'Contactanos' }
}) {
    return (
        <section className="no-encontrado" aria-labelledby="titulo-404">
            <div className="no-encontrado__encabezado">
                <span className="no-encontrado__marca-agua" aria-hidden="true">
                    {codigo}
                </span>
                <h1 id="titulo-404" className="no-encontrado__titulo">
                    {titulo}
                </h1>
            </div>

            <p className="no-encontrado__texto">{descripcion}</p>

            <div className="no-encontrado__acciones">
                {accionPrimaria && (
                    <Button
                        to={accionPrimaria.to}
                        variant="primary"
                        arrow={accionPrimaria.arrow || null}
                        className="no-encontrado__btn"
                    >
                        {accionPrimaria.texto}
                    </Button>
                )}

                {accionSecundaria && (
                    <Button
                        to={accionSecundaria.to}
                        variant="secondary"
                        arrow={accionSecundaria.arrow || null}
                        className="no-encontrado__btn"
                    >
                        {accionSecundaria.texto}
                    </Button>
                )}
            </div>

            {ayudaEnlace && (
                <p className="no-encontrado__ayuda">
                    {ayudaTexto}{' '}
                    <Link className="no-encontrado__ayuda-link" to={ayudaEnlace.to}>
                        {ayudaEnlace.texto}
                    </Link>
                </p>
            )}
        </section>
    );
}
