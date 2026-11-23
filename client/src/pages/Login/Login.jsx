import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../AdminProducto/AdminProducto.css';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [enviando, setEnviando] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setEnviando(true);

        try {
            await login(email, password);
            navigate(location.state?.desde || '/productos', { replace: true });
        } catch (err) {
            setError(err.message);
            setEnviando(false);
        }
    };

    return (
        <section className="admin-producto">
            <header className="seccion-encabezado">
                <h1>Ingresar</h1>
            </header>

            <form className="form-producto" onSubmit={handleSubmit}>
                {error && (
                    <p className="form-producto__alerta" role="alert">
                        {error}
                    </p>
                )}

                <div className="form-producto__campo">
                    <label htmlFor="login-email">Email</label>
                    <input
                        id="login-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        required
                    />
                </div>

                <div className="form-producto__campo">
                    <label htmlFor="login-password">Contraseña</label>
                    <input
                        id="login-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                    />
                </div>

                <button type="submit" disabled={enviando}>
                    {enviando ? 'Ingresando…' : 'Ingresar'}
                </button>
            </form>
        </section>
    );
}
