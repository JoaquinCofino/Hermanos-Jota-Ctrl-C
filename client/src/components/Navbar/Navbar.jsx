import { useState } from 'react';
import logo from '../../assets/logo.svg';
import './Navbar.css';

const LINKS = [
    { vista: 'inicio', texto: 'Inicio' },
    { vista: 'catalogo', texto: 'Catálogo' },
    { vista: 'contacto', texto: 'Contacto' }
];

export default function Navbar({ cantidadCarrito = 0, vistaActual, onNavegar }) {
    const [menuAbierto, setMenuAbierto] = useState(false);

    const handleNavegar = (e, vista) => {
        e.preventDefault();
        onNavegar(vista);
        setMenuAbierto(false);
    };

    return (
        <header className="navbar">
            <div className="navbar__contenedor">
                <a href="/" onClick={(e) => handleNavegar(e, 'inicio')}>
                    <img className="navbar__logo" src={logo} alt="Hermanos Jota" />
                </a>

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
                            <li key={link.vista}>
                                <a
                                    href={`#${link.vista}`}
                                    className={vistaActual === link.vista ? 'navbar__link--activo' : ''}
                                    onClick={(e) => handleNavegar(e, link.vista)}
                                >
                                    {link.texto}
                                </a>
                            </li>
                        ))}
                        <li>
                            <span className="navbar__carrito" aria-label={`Carrito: ${cantidadCarrito} productos`}>
                                Carrito
                                <span className="navbar__contador">{cantidadCarrito}</span>
                            </span>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}
