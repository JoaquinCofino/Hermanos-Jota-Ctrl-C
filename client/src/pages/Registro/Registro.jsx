import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../AdminProducto/AdminProducto.css';

export default function Registro() {
    const { registrar } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [enviando, setEnviando] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setEnviando(true);

        try {
            await registrar(nombre, email, password);
            navigate(location.state?.desde || '/productos', { replace: true });
        } catch (err) {
            setError(
                err.status === 409
                    ? 'Ya existe una cuenta con ese email.'
                    : err.message
            );
            setEnviando(false);
        }
    };

    return (
        <section className="admin-producto">
            <header className="seccion-encabezado">
                <h1>Crear cuenta</h1>
            </header>

            <form className="form-producto" onSubmit={handleSubmit}>
                {error && (
                    <p className="form-producto__alerta" role="alert">
                        {error}
                    </p>
                )}

                <div className="form-producto__campo">
                    <label htmlFor="registro-nombre">Nombre</label>
                    <input
                        id="registro-nombre"
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        autoComplete="name"
                        required
                    />
                </div>

                <div className="form-producto__campo">
                    <label htmlFor="registro-email">Email</label>
                    <input
                        id="registro-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        required
                    />
                </div>

                <div className="form-producto__campo">
                    <label htmlFor="registro-password">Contraseña</label>
                    <input
                        id="registro-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                        required
                    />
                </div>

                <button type="submit" disabled={enviando}>
                    {enviando ? 'Creando cuenta…' : 'Crear cuenta'}
                </button>

                <p>
                    ¿Ya tenés cuenta?{' '}
                    <Link to="/login" state={location.state}>Ingresá</Link>
                </p>
            </form>
        </section>
    );
}
