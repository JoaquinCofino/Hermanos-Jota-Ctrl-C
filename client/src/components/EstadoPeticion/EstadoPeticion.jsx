// Muestra "cargando" o el error del fetch; si la petición terminó bien, renderiza el contenido.
export default function EstadoPeticion({ cargando, error, onReintentar, children }) {
    if (cargando) {
        return <p className="estado">Cargando productos…</p>;
    }

    if (error) {
        return (
            <div className="estado estado--error">
                <p>{error}</p>
                <button type="button" onClick={onReintentar}>
                    Reintentar
                </button>
            </div>
        );
    }

    return children;
}
