import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import './Navbar.css';

const LINKS = [
    { to: '/', texto: 'Inicio' },
    { to: '/productos', texto: 'Catálogo' },
    { to: '/contacto', texto: 'Contacto' }
];

function ShoppingCart({ size = 20, className = 'lucide lucide-shopping-cart preview-icon', ...props }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            {...props}
        >
            <path d="m2.05 2.05 1.099-.028a1 1 0 0 1 1.008.815l2.69 14.347A1 1 0 0 0 7.83 18H18" />
            <path d="M4.563 5h16.435a1 1 0 0 1 .981 1.204l-1.026 6.226A2 2 0 0 1 18.962 14H6.25" />
            <circle cx="18" cy="20" r="2" />
            <circle cx="8" cy="20" r="2" />
        </svg>
    );
}

export default function Navbar({ cantidadCarrito = 0 }) {
    const [menuAbierto, setMenuAbierto] = useState(false);

    const cerrarMenu = () => setMenuAbierto(false);

    return (
        <header className="navbar">
            <div className="navbar__contenedor">
                <Link to="/" onClick={cerrarMenu}>
                    <img className="navbar__logo" src={logo} alt="Hermanos Jota" />
                </Link>

                <button
                    type="button"
                    className="navbar__toggle"
                    aria-expanded={menuAbierto}
                    aria-controls="menu-principal"
                    aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
                    onClick={() => setMenuAbierto((abierto) => !abierto)}
                >
                    ☰
                </button>

                <nav>
                    <ul
                        id="menu-principal"
                        className={`navbar__links ${menuAbierto ? 'navbar__links--abierto' : ''}`}
                    >
                        {LINKS.map((link) => (
                            <li key={link.to}>
                                {/* "end" evita que "/" quede activo en todas las rutas */}
                                <NavLink
                                    to={link.to}
                                    end={link.to === '/'}
                                    className={({ isActive }) => (isActive ? 'navbar__link--activo' : '')}
                                    onClick={cerrarMenu}
                                >
                                    {link.texto}
                                </NavLink>
                            </li>
                        ))}
                        <li>
                            <NavLink
                                to="/carrito"
                                className={({ isActive }) =>
                                    `navbar__carrito ${isActive ? 'navbar__link--activo' : ''}`
                                }
                                aria-label={`Carrito: ${cantidadCarrito} productos`}
                                onClick={cerrarMenu}
                            >
                                <ShoppingCart size={20} />
                                <span className="navbar__contador">{cantidadCarrito}</span>
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}
