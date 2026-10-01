import './Footer.css';

function Footer() {
    return (
    <>
    <footer className="site-footer">
        <div className="contenedor">
            <div className="footer-info">
            <div className="footer-showroom">
            <h3>Showroom y Taller</h3>

            <p>
                <strong>Hermanos Jota</strong><br />
                Av. San Juan 2847<br />
                Argentina
            </p>

            <p>
                <strong>Horarios:</strong><br />
                Lunes a Viernes: 10:00 - 19:00<br />
                Sábados: 10:00 - 14:00
            </p>
            </div>

            <div className="footer-contacto">
            <h3>Contacto</h3>

            <p>
                <strong>Instagram:</strong><br />
                <a
                href="https://www.instagram.com/hermanosjota_ba/"
                target="_blank"
                rel="noopener noreferrer"
                >
                @hermanosjota_ba
                </a>
            </p>

            <p>
                <strong>WhatsApp:</strong><br />
                <a
                href="https://wa.me/541145678900"
                target="_blank"
                rel="noopener noreferrer"
                >
                +54 11 4567-8900
                </a>
            </p>
            </div>

        </div>

        <div className="footer-bottom">
            <p>
            &copy; 2026 Hermanos Jota. Todos los derechos reservados.
            </p>
        </div>
        </div>
    </footer>
    </>
);
}

export default Footer;