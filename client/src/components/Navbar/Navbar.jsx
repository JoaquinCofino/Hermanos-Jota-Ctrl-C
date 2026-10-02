import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import './Navbar.css';

const LINKS = [
    { to: '/', texto: 'Inicio' },
    { to: '/productos', texto: 'Catálogo' },
    { to: '/contacto', texto: 'Contacto' }
];

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
                                Carrito
                                <span className="navbar__contador">{cantidadCarrito}</span>
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}
