/**
 * Validación del lado del cliente + mensaje de éxito vía DOM (sin backend real)
 */
function validarEmail(valor) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
}

function inicializarFormularioContacto() {
  const formulario = document.querySelector("[data-form-contacto]");
  if (!formulario) return;

  const mensaje = formulario.querySelector("[data-mensaje-formulario]");

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const nombre = formulario.nombre.value.trim();
    const email = formulario.email.value.trim();
    const texto = formulario.mensaje.value.trim();
    const errores = [];

    if (nombre.length < 2) errores.push("El nombre es obligatorio.");
    if (!validarEmail(email)) errores.push("Ingresá un email válido.");
    if (texto.length < 10) errores.push("El mensaje debe tener al menos 10 caracteres.");

    if (errores.length > 0) {
      mensaje.textContent = errores.join(" ");
      mensaje.className = "mensaje-formulario mensaje-formulario--error";
      mensaje.hidden = false;
      return;
    }

    // Sin backend: se simula el envío exitoso actualizando el DOM.
    mensaje.textContent = `¡Gracias ${nombre}! Recibimos tu mensaje y te responderemos a la brevedad.`;
    mensaje.className = "mensaje-formulario mensaje-formulario--exito";
    mensaje.hidden = false;
    formulario.reset();
  });
}

document.addEventListener("DOMContentLoaded", inicializarFormularioContacto);
