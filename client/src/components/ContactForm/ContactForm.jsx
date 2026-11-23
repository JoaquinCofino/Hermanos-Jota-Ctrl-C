import { useState } from "react";
import useFormulario from "../../hooks/useFormulario";
import {
  validarEmail,
  validarMensaje,
  validarNombre,
} from "../../utils/validaciones";
import "./ContactForm.css";

// El orden de las claves define qué campo recibe el foco primero cuando hay errores.
const REGLAS = {
  nombre: validarNombre,
  email: validarEmail,
  mensaje: validarMensaje,
};

function ContactForm() {
  const { valores, errores, handleChange, validar } = useFormulario(
    { nombre: "", email: "", mensaje: "" },
    REGLAS
  );

  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const erroresNuevos = validar();
    const primerCampo = Object.keys(erroresNuevos)[0];

    if (primerCampo) {
      e.currentTarget.elements[primerCampo]?.focus();
      return;
    }

    setEnviado(true);
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
            <p className="nota-obligatorios">
              Los campos marcados con * son obligatorios.
            </p>

            {/* Nombre */}
            <div className={`form-grupo ${errores.nombre ? "has-error" : ""}`}>
              <label htmlFor="nombre">
                Nombre
                <span className="obligatorio" aria-hidden="true"> *</span>
              </label>

              <input
                type="text"
                id="nombre"
                name="nombre"
                placeholder="Tu nombre completo"
                value={valores.nombre}
                onChange={handleChange}
                autoComplete="name"
                required
                aria-invalid={errores.nombre ? "true" : "false"}
                aria-describedby={errores.nombre ? "nombre-error" : undefined}
              />

              {errores.nombre && (
                <span id="nombre-error" className="error-mensaje">
                  {errores.nombre}
                </span>
              )}
            </div>

            {/* Email */}
            <div className={`form-grupo ${errores.email ? "has-error" : ""}`}>
              <label htmlFor="email">
                Email
                <span className="obligatorio" aria-hidden="true"> *</span>
              </label>

              <input
                type="email"
                id="email"
                name="email"
                placeholder="tu@email.com"
                value={valores.email}
                onChange={handleChange}
                autoComplete="email"
                autoCapitalize="none"
                inputMode="email"
                spellCheck={false}
                required
                aria-invalid={errores.email ? "true" : "false"}
                aria-describedby={errores.email ? "email-error" : undefined}
              />

              {errores.email && (
                <span id="email-error" className="error-mensaje">
                  {errores.email}
                </span>
              )}
            </div>

            {/* Mensaje */}
            <div className={`form-grupo ${errores.mensaje ? "has-error" : ""}`}>
              <label htmlFor="mensaje">
                Mensaje
                <span className="obligatorio" aria-hidden="true"> *</span>
              </label>

              <textarea
                id="mensaje"
                name="mensaje"
                rows="5"
                placeholder="¿En qué podemos ayudarte?"
                value={valores.mensaje}
                onChange={handleChange}
                required
                aria-invalid={errores.mensaje ? "true" : "false"}
                aria-describedby={errores.mensaje ? "mensaje-error" : undefined}
              />

              {errores.mensaje && (
                <span id="mensaje-error" className="error-mensaje">
                  {errores.mensaje}
                </span>
              )}
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
            role="status"
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