import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import obtenerIniciales from '../../utils/obtenerIniciales';
import './Navbar.css';

const LINKS_TIENDA = [
    { to: '/', texto: 'Inicio' },
    { to: '/productos', texto: 'Catálogo' },
    { to: '/contacto', texto: 'Contacto' }
];

const LINKS_CUENTA = [
    { to: '/perfil', texto: 'Mi perfil' },
    { to: '/mis-pedidos', texto: 'Mis pedidos' }
];

function ShoppingCart({ size = 20, ...props }) {
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
            aria-hidden="true"
            {...props}
        >
            <path d="m2.05 2.05 1.099-.028a1 1 0 0 1 1.008.815l2.69 14.347A1 1 0 0 0 7.83 18H18" />
            <path d="M4.563 5h16.435a1 1 0 0 1 .981 1.204l-1.026 6.226A2 2 0 0 1 18.962 14H6.25" />
            <circle cx="18" cy="20" r="2" />
            <circle cx="8" cy="20" r="2" />
        </svg>
    );
}

export default function Navbar() {
    const { usuario, logout } = useAuth();
    const { cantidadTotal: cantidadCarrito } = useCart();
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [dropdownAbierto, setDropdownAbierto] = useState(false);
    const dropdownRef = useRef(null);
    const { pathname } = useLocation();

    const cerrarMenu = () => setMenuAbierto(false);
    const cerrarDropdown = () => setDropdownAbierto(false);

    const iniciales = usuario ? obtenerIniciales(usuario.nombre) : '';

    // Cerrar menús al cambiar de ruta
    useEffect(() => {
        setMenuAbierto(false);
        setDropdownAbierto(false);
    }, [pathname]);

    // Menú móvil: Escape y bloqueo de scroll del body
    useEffect(() => {
        if (!menuAbierto) return;

        const alPresionarTecla = (e) => {
            if (e.key === 'Escape') setMenuAbierto(false);
        };

        document.addEventListener('keydown', alPresionarTecla);
        document.body.classList.add('menu-mobile-abierto');

        return () => {
            document.removeEventListener('keydown', alPresionarTecla);
            document.body.classList.remove('menu-mobile-abierto');
        };
    }, [menuAbierto]);

    // Dropdown de cuenta en escritorio: clic fuera o Escape
    useEffect(() => {
        if (!dropdownAbierto) return;

        const alHacerClicFuera = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownAbierto(false);
            }
        };

        const alPresionarTecla = (e) => {
            if (e.key === 'Escape') setDropdownAbierto(false);
        };

        document.addEventListener('mousedown', alHacerClicFuera);
        document.addEventListener('keydown', alPresionarTecla);

        return () => {
            document.removeEventListener('mousedown', alHacerClicFuera);
            document.removeEventListener('keydown', alPresionarTecla);
        };
    }, [dropdownAbierto]);

    const handleLogout = () => {
        logout();
        cerrarMenu();
        cerrarDropdown();
    };

    return (
        <>
            <header className={`navbar ${menuAbierto ? 'navbar--abierto' : ''}`}>
                <div className="navbar__contenedor">
                    <Link to="/" className="navbar__marca" onClick={cerrarMenu}>
                        <img className="navbar__logo" src={logo} alt="Hermanos Jota" />
                    </Link>

                    <nav id="menu-principal" className="navbar__menu" aria-label="Principal">
                        <ul className="navbar__links">
                            {LINKS_TIENDA.map((link, indice) => (
                                <li key={link.to} style={{ '--i': indice }}>
                                    {/* "end" evita que "/" quede activo en todas las rutas */}
                                    <NavLink
                                        to={link.to}
                                        end={link.to === '/'}
                                        className={({ isActive }) =>
                                            `navbar__link ${isActive ? 'navbar__link--activo' : ''}`
                                        }
                                        onClick={cerrarMenu}
                                    >
                                        {link.texto}
                                    </NavLink>
                                </li>
                            ))}

                            {usuario &&
                                LINKS_CUENTA.map((link, indice) => (
                                    <li
                                        key={link.to}
                                        className="navbar__item--solo-mobile"
                                        style={{ '--i': LINKS_TIENDA.length + indice }}
                                    >
                                        <NavLink
                                            to={link.to}
                                            className={({ isActive }) =>
                                                `navbar__link ${isActive ? 'navbar__link--activo' : ''}`
                                            }
                                            onClick={cerrarMenu}
                                        >
                                            {link.texto}
                                        </NavLink>
                                    </li>
                                ))}
                        </ul>

                        {usuario ? (
                            <div className="navbar__cuenta navbar__cuenta--mobile">
                                <p className="navbar__saludo" title={usuario.nombre}>
                                    Hola, <strong>{usuario.nombre}</strong>
                                </p>
                                <button
                                    type="button"
                                    className="navbar__boton navbar__boton--secundario"
                                    onClick={handleLogout}
                                >
                                    Cerrar sesión
                                </button>
                            </div>
                        ) : (
                            <div className="navbar__cuenta">
                                <NavLink
                                    to="/login"
                                    className="navbar__boton navbar__boton--primario"
                                    onClick={cerrarMenu}
                                >
                                    Ingresar
                                </NavLink>
                            </div>
                        )}
                    </nav>

                    <div className="navbar__acciones">
                        <NavLink
                            to="/carrito"
                            className={({ isActive }) =>
                                `navbar__carrito ${isActive ? 'navbar__carrito--activo' : ''}`
                            }
                            aria-label={`Carrito: ${cantidadCarrito} ${
                                cantidadCarrito === 1 ? 'producto' : 'productos'
                            }`}
                            onClick={cerrarMenu}
                        >
                            <ShoppingCart size={20} />
                            <span className="navbar__contador">{cantidadCarrito}</span>
                        </NavLink>

                        {usuario && (
                            <div className="navbar__avatar-menu" ref={dropdownRef}>
                                <button
                                    type="button"
                                    className="navbar__avatar navbar__avatar--boton"
                                    aria-haspopup="menu"
                                    aria-expanded={dropdownAbierto}
                                    aria-label={`Menú de cuenta de ${usuario.nombre}`}
                                    onClick={() => setDropdownAbierto((abierto) => !abierto)}
                                >
                                    {iniciales}
                                </button>

                                {dropdownAbierto && (
                                    <div
                                        className="navbar__dropdown"
                                        role="menu"
                                        aria-label="Opciones de cuenta"
                                    >
                                        <div className="navbar__dropdown-cabecera">
                                            <span className="navbar__dropdown-nombre" title={usuario.nombre}>
                                                {usuario.nombre}
                                            </span>
                                        </div>

                                        <div className="navbar__dropdown-grupo">
                                            {LINKS_CUENTA.map((link) => (
                                                <NavLink
                                                    key={link.to}
                                                    to={link.to}
                                                    role="menuitem"
                                                    className={({ isActive }) =>
                                                        `navbar__dropdown-item ${
                                                            isActive ? 'navbar__dropdown-item--activo' : ''
                                                        }`
                                                    }
                                                    onClick={cerrarDropdown}
                                                >
                                                    {link.texto}
                                                </NavLink>
                                            ))}
                                        </div>

                                        <div className="navbar__dropdown-divisor" role="separator" />

                                        <button
                                            type="button"
                                            role="menuitem"
                                            className="navbar__dropdown-item navbar__dropdown-item--salir"
                                            onClick={handleLogout}
                                        >
                                            Cerrar sesión
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        <button
                            type="button"
                            className="navbar__toggle"
                            aria-expanded={menuAbierto}
                            aria-controls="menu-principal"
                            aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
                            onClick={() => setMenuAbierto((abierto) => !abierto)}
                        >
                            {/* Tres barras que se transforman en una X al abrir */}
                            <span className="navbar__toggle-barra" aria-hidden="true" />
                            <span className="navbar__toggle-barra" aria-hidden="true" />
                            <span className="navbar__toggle-barra" aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </header>

            <div
                className={`navbar-fondo ${menuAbierto ? 'navbar-fondo--visible' : ''}`}
                onClick={cerrarMenu}
                aria-hidden="true"
            />
        </>
    );
}
