import { useState } from 'react';
import './ContactForm.css';

export default function ContactForm() {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        mensaje: ''
    });

    const [enviado, setEnviado] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Datos enviados:', formData);
        setEnviado(true);

        // Resetea los campos
        setFormData({
            nombre: '',
            email: '',
            mensaje: ''
        });
    };

    return (
        <section className="contact-section">
            <h2 className="contact-title">
                Contacto - Hermanos Jota
            </h2>

            {enviado && (
                <p className="success-message">
                    ¡Tu mensaje fue enviado con éxito! Nos pondremos en contacto pronto.
                </p>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                    <label htmlFor="nombre">Nombre completo</label>
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                        placeholder="Tu nombre"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Correo electrónico</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="tu@email.com"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="mensaje">Mensaje o consulta</label>
                    <textarea
                        id="mensaje"
                        name="mensaje"
                        rows="4"
                        value={formData.mensaje}
                        onChange={handleChange}
                        required
                        placeholder="Escribe tu consulta aquí..."
                    />
                </div>

                <button type="submit" className="submit-button">
                    Enviar mensaje
                </button>
            </form>
        </section>
    );
}