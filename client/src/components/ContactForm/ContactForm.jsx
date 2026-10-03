import { useState } from "react";
import "./ContactForm.css";

function ContactForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    mensaje: "",
  });

  const [errores, setErrores] = useState({
    nombre: false,
    email: false,
    mensaje: false,
  });

  const [enviado, setEnviado] = useState(false);

  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar el error del campo mientras escribe
    setErrores((prev) => ({
      ...prev,
      [name]: false,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nuevosErrores = {
      nombre: formData.nombre.trim() === "",
      email:
        formData.email.trim() === "" ||
        !validarEmail(formData.email.trim()),
      mensaje: formData.mensaje.trim() === "",
    };

    setErrores(nuevosErrores);

    const hayErrores = Object.values(nuevosErrores).some(Boolean);

    if (!hayErrores) {
      setEnviado(true);
    }
  };

  return (
    <section className="contacto-main">
      <div className="columna-formulario">
        <h2>Envíanos un mensaje</h2>

        {!enviado && (
          <form
            id="form-contacto"
            className="form-contacto"
            onSubmit={handleSubmit}
            noValidate
          >
            {/* Nombre */}
            <div
              className={`form-grupo ${
                errores.nombre ? "has-error" : ""
              }`}
            >
              <label htmlFor="nombre">Nombre</label>

              <input
                type="text"
                id="nombre"
                name="nombre"
                placeholder="Tu nombre completo"
                value={formData.nombre}
                onChange={handleChange}
              />

              <span className="error-mensaje">
                Este campo es obligatorio.
              </span>
            </div>

            {/* Email */}
            <div
              className={`form-grupo ${
                errores.email ? "has-error" : ""
              }`}
            >
              <label htmlFor="email">Email</label>

              <input
                type="email"
                id="email"
                name="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleChange}
              />

              <span className="error-mensaje">
                Ingresa un email válido.
              </span>
            </div>

            {/* Mensaje */}
            <div
              className={`form-grupo ${
                errores.mensaje ? "has-error" : ""
              }`}
            >
              <label htmlFor="mensaje">Mensaje</label>

              <textarea
                id="mensaje"
                name="mensaje"
                rows="5"
                placeholder="¿En qué podemos ayudarte?"
                value={formData.mensaje}
                onChange={handleChange}
              />

              <span className="error-mensaje">
                El mensaje no puede estar vacío.
              </span>
            </div>

            <button type="submit" className="btn-enviar">
              Enviar Mensaje
            </button>
          </form>
        )}

        {enviado && (
          <div
            id="feedback-mensaje"
            className="feedback-mensaje"
          >
            ¡Gracias por contactarnos! Tu mensaje ha sido enviado con
            éxito.
          </div>
        )}
      </div>

      <div className="columna-info">
        <div className="mapa-contenedor">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3283.2170003256056!2d-58.40734852296306!3d-34.623956158569534!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccae2a0c04a2f%3A0x77f381af8f0ca1fa!2sAv.%20San%20Juan%202847%2C%20C1232AAK%20Cdad.%20Aut%C3%B3noma%20de%20Buenos%20Aires!5e0!3m2!1ses-419!2sar!4v1788048164555!5m2!1ses-419!2sar"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación de Hermanos Jota en Av. San Juan 2847"
          />
        </div>

        <div className="datos-contacto">
          <h3>Hermanos Jota — Casa Taller</h3>

          <p className="direccion">
            Av. San Juan 2847, C1232AAB
            <br />
            Barrio de San Cristóbal, CABA, Argentina
          </p>

          <div className="horarios">
            <h4>Horarios de atención</h4>

            <ul>
              <li>Lunes a Viernes: 10:00 - 19:00</li>
              <li>Sábados: 10:00 - 14:00</li>
            </ul>
          </div>

          <table className="tabla-contacto">
            <tbody>
              <tr>
                <th>Email General:</th>
                <td>
                  <a href="mailto:info@hermanosjota.com.ar">
                    info@hermanosjota.com.ar
                  </a>
                </td>
              </tr>

              <tr>
                <th>Ventas:</th>
                <td>
                  <a href="mailto:ventas@hermanosjota.com.ar">
                    ventas@hermanosjota.com.ar
                  </a>
                </td>
              </tr>

              <tr>
                <th>Instagram:</th>
                <td>
                  <a
                    href="https://instagram.com/hermanosjota_ba"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @hermanosjota_ba
                  </a>
                </td>
              </tr>

              <tr>
                <th>WhatsApp:</th>
                <td>
                  <a
                    href="https://wa.me/541145678900"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    +54 11 4567-8900
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default ContactForm;