import { Link } from 'react-router-dom';
import './Button.css';

function Flecha({ direccion }) {
    return (
        <svg
            className={`hj-btn__flecha hj-btn__flecha--${direccion}`}
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            {direccion === 'left' ? (
                <>
                    <path d="M19 12H5" />
                    <path d="m12 19-7-7 7-7" />
                </>
            ) : (
                <>
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                </>
            )}
        </svg>
    );
}

/**
 * Botón / enlace CTA reutilizable según el Manual de Marca de Hermanos Jota.
 * - Si recibe `to`, renderiza `<Link>` de react-router-dom.
 * - Si recibe `href`, renderiza `<a>`.
 * - En caso contrario, renderiza `<button>`.
 */
export default function Button({
    variant = 'primary',
    size = 'md',
    arrow = null,
    fullWidth = false,
    to,
    href,
    type = 'button',
    className = '',
    children,
    ...props
}) {
    const clases = [
        'hj-btn',
        `hj-btn--${variant}`,
        `hj-btn--${size}`,
        fullWidth ? 'hj-btn--full' : '',
        className
    ]
        .filter(Boolean)
        .join(' ');

    const contenido = (
        <span className="hj-btn__contenido">
            {arrow === 'left' && <Flecha direccion="left" />}
            <span>{children}</span>
            {arrow === 'right' && <Flecha direccion="right" />}
        </span>
    );

    if (to) {
        return (
            <Link to={to} className={clases} {...props}>
                {contenido}
            </Link>
        );
    }

    if (href) {
        return (
            <a href={href} className={clases} {...props}>
                {contenido}
            </a>
        );
    }

    return (
        <button type={type} className={clases} {...props}>
            {contenido}
        </button>
    );
}
