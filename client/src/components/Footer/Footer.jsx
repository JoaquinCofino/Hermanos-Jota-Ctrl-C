import { Link } from 'react-router-dom';
import BrandLogo from '../BrandLogo/BrandLogo';
import './Footer.css';

function IconoInstagram() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
    );
}

function IconoWhatsApp() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
            <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
        </svg>
    );
}

function Footer() {
    return (
        <footer className="site-footer">
            <div className="contenedor">
                <div className="footer-grid">
                    <div className="footer-marca">
                        <Link
                            to="/"
                            className="footer-logo"
                            aria-label="Hermanos Jota — Ir al inicio"
                        >
                            <BrandLogo
                                variant="siena"
                                width={60}
                                className="footer-logo__svg"
                            />
                        </Link>
                    </div>

                    <div className="footer-showroom">
                        <h2 className="footer-titulo">Showroom y Taller</h2>

                        <address className="footer-direccion">
                            <p className="footer-texto">
                                Hermanos Jota
                                <br />
                                Av. San Juan 2847 · Argentina
                            </p>

                            <p className="footer-texto footer-horarios">
                                Lunes a Viernes: 10:00 – 19:00
                                <br />
                                Sábados: 10:00 – 14:00
                            </p>
                        </address>
                    </div>

                    <div className="footer-contacto">
                        <h2 className="footer-titulo">Contacto</h2>

                        <ul className="footer-contacto__lista">
                            <li>
                                <a
                                    className="footer-contacto__link"
                                    href="https://www.instagram.com/hermanosjota_ba/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Seguir a Hermanos Jota en Instagram"
                                >
                                    <span className="footer-contacto__icono">
                                        <IconoInstagram />
                                    </span>
                                    <span>@hermanosjota_ba</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    className="footer-contacto__link"
                                    href="https://wa.me/541145678900"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Escribir por WhatsApp a Hermanos Jota"
                                >
                                    <span className="footer-contacto__icono">
                                        <IconoWhatsApp />
                                    </span>
                                    <span>+54 11 4567-8900</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2026 Hermanos Jota</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
