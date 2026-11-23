import { useState } from 'react';

export default function useFormulario(valoresIniciales, reglas) {
    const [valores, setValores] = useState(valoresIniciales);
    const [errores, setErrores] = useState({});

    function handleChange(e) {
        const { name, value } = e.target;

        setValores((prev) => ({ ...prev, [name]: value }));

        setErrores((prev) =>
            prev[name]
                ? { ...prev, [name]: reglas[name]?.(value) || '' }
                : prev
        );
    }
    
    function validar() {
        const nuevos = {};

        for (const nombre of Object.keys(reglas)) {
            const mensaje = reglas[nombre](valores[nombre]);
            if (mensaje) nuevos[nombre] = mensaje;
        }

        setErrores(nuevos);
        return nuevos;
    }

    // Para errores que llegan del servidor y pertenecen a un campo (ej. email duplicado).
    function setError(nombre, mensaje) {
        setErrores((prev) => ({ ...prev, [nombre]: mensaje }));
    }

    return { valores, errores, handleChange, validar, setError };
}