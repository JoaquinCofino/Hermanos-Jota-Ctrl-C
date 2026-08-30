/**
 * Lógica de interacción para la página de Contacto
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Lógica del formulario de contacto
    const formContacto = document.getElementById('form-contacto');
    const feedbackMensaje = document.getElementById('feedback-mensaje');

    if (formContacto) {
        formContacto.addEventListener('submit', function (e) {
            e.preventDefault(); // Evitamos el envío por defecto

            // Referencias a los campos
            const inputNombre = document.getElementById('nombre');
            const inputEmail = document.getElementById('email');
            const inputMensaje = document.getElementById('mensaje');

            let isValid = true;

            // Validación de Nombre
            if (inputNombre.value.trim() === '') {
                marcarError(inputNombre, true);
                isValid = false;
            } else {
                marcarError(inputNombre, false);
            }

            // Validación de Email
            if (inputEmail.value.trim() === '' || !validarEmail(inputEmail.value.trim())) {
                marcarError(inputEmail, true);
                isValid = false;
            } else {
                marcarError(inputEmail, false);
            }

            // Validación de Mensaje
            if (inputMensaje.value.trim() === '') {
                marcarError(inputMensaje, true);
                isValid = false;
            } else {
                marcarError(inputMensaje, false);
            }

            // Si todo es válido, mostramos feedback y limpiamos el form
            if (isValid) {
                // Ocultar formulario y mostrar mensaje de éxito
                formContacto.style.display = 'none';
                feedbackMensaje.hidden = false;
            }
        });

        // Limpiar errores al escribir
        const inputs = formContacto.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                marcarError(input, false);
            });
        });
    }

    /**
     * Función auxiliar para marcar/desmarcar error visual en un campo
     * @param {HTMLElement} elemento - Input o Textarea
     * @param {boolean} conError - Si tiene error o no
     */
    function marcarError(elemento, conError) {
        const grupo = elemento.closest('.form-grupo');
        if (conError) {
            grupo.classList.add('has-error');
        } else {
            grupo.classList.remove('has-error');
        }
    }

    /**
     * Función auxiliar para validar formato de email mediante Regex
     * @param {string} email 
     * @returns {boolean}
     */
    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // 2. Lógica del Carrito Simulado (Contador)
    const contadorElemento = document.querySelector('[data-carrito-contador]');
    
    if (contadorElemento) {
        // Leemos el valor del localStorage o inicializamos en 0
        const carrito = JSON.parse(localStorage.getItem('hj_carrito')) || [];
        const cantidadEnCarrito = carrito.length;
        
        // Actualizamos la vista inicial
        actualizarContador(cantidadEnCarrito);


    }

    /**
     * Actualiza el texto del contador del carrito
     * @param {number} cantidad 
     */
    function actualizarContador(cantidad) {
        if (contadorElemento) {
            contadorElemento.textContent = cantidad;
        }
    }
});
