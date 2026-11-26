import './AuthForm.css';

// Campo de formulario (label + input + ayuda + error) para Login y Registro.
// Usa el mismo lenguaje visual que el formulario de contacto.
export default function CampoAuth({
    id,
    name,
    label,
    type = 'text',
    value,
    onChange,
    error,
    ayuda,
    obligatorio = true,
    autoComplete,
}) {
    const idError = `${id}-error`;
    const idAyuda = `${id}-ayuda`;

    // El lector de pantalla lee la ayuda y el error al enfocar el campo.
    const describedBy =
        [ayuda && idAyuda, error && idError].filter(Boolean).join(' ') || undefined;

    const propsEmail =
        type === 'email'
            ? { inputMode: 'email', autoCapitalize: 'none', spellCheck: false }
            : {};

    return (
        <div className={`auth-grupo${error ? ' auth-grupo--error' : ''}`}>
            <label htmlFor={id}>
                {label}
                {obligatorio && (
                    <span className="auth-obligatorio" aria-hidden="true">
                        {' '}*
                    </span>
                )}
            </label>

            <input
                id={id}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                autoComplete={autoComplete}
                required={obligatorio}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={describedBy}
                {...propsEmail}
            />

            {ayuda && (
                <span id={idAyuda} className="auth-ayuda">
                    {ayuda}
                </span>
            )}

            {error && (
                <span id={idError} className="auth-error">
                    {error}
                </span>
            )}
        </div>
    );
}