import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useFormulario from '../../hooks/useFormulario';
import CampoAuth from '../../components/AuthForm/CampoAuth';
import {
    mensajeErrorLogin,
    validarEmail,
    validarPasswordLogin,
} from '../../utils/validaciones';
import '../../components/AuthForm/AuthForm.css';

const REGLAS = {
    email: validarEmail,
    password: validarPasswordLogin,
};

export default function Login() {
    const { login, usuario, cargando } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const { valores, errores, handleChange, validar } = useFormulario(
        { email: '', password: '' },
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
            await login(valores.email.trim(), valores.password);
            navigate(location.state?.desde || '/productos', { replace: true });
        } catch (err) {
            setErrorServidor(mensajeErrorLogin(err));
            setEnviando(false);
        }
    };

    return (
        <section className="auth">
            <header className="seccion-encabezado">
                <h1>Ingresar</h1>
                <p className="seccion-subtitulo">
                    Accedé a tu cuenta para ver tus pedidos y comprar.
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
                        id="login-email"
                        name="email"
                        label="Email"
                        type="email"
                        value={valores.email}
                        onChange={handleChange}
                        error={errores.email}
                        autoComplete="email"
                    />

                    <CampoAuth
                        id="login-password"
                        name="password"
                        label="Contraseña"
                        type="password"
                        value={valores.password}
                        onChange={handleChange}
                        error={errores.password}
                        autoComplete="current-password"
                    />

                    <button type="submit" className="auth-boton" disabled={enviando}>
                        {enviando ? 'Ingresando…' : 'Ingresar'}
                    </button>

                    <p className="auth-pie">
                        ¿No tenés cuenta?{' '}
                        <Link to="/registro" state={location.state}>
                            Creá una
                        </Link>
                    </p>
                </form>
            </div>
        </section>
    );
}