import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useFormulario from '../../hooks/useFormulario';
import CampoAuth from '../../components/AuthForm/CampoAuth';
import '../../components/AuthForm/AuthForm.css';
import {
    PASSWORD_MIN,
    resolverErrorRegistro,
    validarEmail,
    validarNombre,
    validarPasswordRegistro,
} from '../../utils/validaciones';

const REGLAS = {
    nombre: validarNombre,
    email: validarEmail,
    password: validarPasswordRegistro,
};

export default function Registro() {
    const { registrar, usuario, cargando } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const { valores, errores, handleChange, validar, setError } = useFormulario(
        { nombre: '', email: '', password: '' },
        REGLAS
    );
    const [errorServidor, setErrorServidor] = useState(null);
    const [enviando, setEnviando] = useState(false);

    if (cargando) {
        return <p className="estado">Verificando sesión…</p>;
    }

    if (usuario) {
        return <Navigate to={location.state?.desde || '/productos'} replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formulario = e.currentTarget;
        setErrorServidor(null);

        const erroresNuevos = validar();
        const primerCampo = Object.keys(erroresNuevos)[0];

        if (primerCampo) {
            formulario.elements[primerCampo]?.focus();
            return;
        }

        setEnviando(true);

        try {
            await registrar(valores.nombre.trim(), valores.email.trim(), valores.password);
            navigate(location.state?.desde || '/productos', { replace: true });
        } catch (err) {
            const { campo, mensaje } = resolverErrorRegistro(err);

            if (campo) {
                setError(campo, mensaje);
                formulario.elements[campo]?.focus();
            } else {
                setErrorServidor(mensaje);
            }

            setEnviando(false);
        }
    };

    return (
        <section className="auth">
            <header className="seccion-encabezado">
                <h1>Crear cuenta</h1>
                <p className="seccion-subtitulo">
                    Registrate para hacer pedidos y seguirlos desde tu perfil.
                </p>
            </header>

            <div className="auth-card">
                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                    noValidate
                    aria-busy={enviando}
                >
                    {errorServidor && (
                        <p className="auth-alerta" role="alert">
                            {errorServidor}
                        </p>
                    )}

                    <p className="auth-nota">
                        Los campos marcados con * son obligatorios.
                    </p>

                    <CampoAuth
                        id="registro-nombre"
                        name="nombre"
                        label="Nombre"
                        value={valores.nombre}
                        onChange={handleChange}
                        error={errores.nombre}
                        autoComplete="name"
                    />

                    <CampoAuth
                        id="registro-email"
                        name="email"
                        label="Email"
                        type="email"
                        value={valores.email}
                        onChange={handleChange}
                        error={errores.email}
                        autoComplete="email"
                    />

                    <CampoAuth
                        id="registro-password"
                        name="password"
                        label="Contraseña"
                        type="password"
                        value={valores.password}
                        onChange={handleChange}
                        error={errores.password}
                        ayuda={`Mínimo ${PASSWORD_MIN} caracteres.`}
                        autoComplete="new-password"
                    />

                    <button type="submit" className="auth-boton" disabled={enviando}>
                        {enviando ? 'Creando cuenta…' : 'Crear cuenta'}
                    </button>

                    <p className="auth-pie">
                        ¿Ya tenés cuenta?{' '}
                        <Link to="/login" state={location.state}>
                            Ingresá
                        </Link>
                    </p>
                </form>
            </div>
        </section>
    );
}
