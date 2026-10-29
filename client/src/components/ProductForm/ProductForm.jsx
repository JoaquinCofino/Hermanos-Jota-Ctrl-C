import { useState } from 'react';
import { rutaImagen } from '../../services/api';
import './ProductForm.css';

const VALORES_VACIOS = {
    nombre: '',
    categoria: '',
    precio: '',
    stock: '',
    imagenUrl: '',
    descripcion: '',
    destacado: false
};

// Pasa un producto de la API a los valores del formulario (los inputs trabajan con strings)
function valoresDesdeProducto(producto) {
    if (!producto) return VALORES_VACIOS;
    return {
        nombre: producto.nombre ?? '',
        categoria: producto.categoria ?? '',
        precio: producto.precio != null ? String(producto.precio) : '',
        stock: producto.stock != null ? String(producto.stock) : '',
        // imagenUrl es el valor crudo de Mongo; "imagen" es el del backend viejo
        imagenUrl: producto.imagenUrl ?? producto.imagen ?? '',
        descripcion: producto.descripcion ?? '',
        destacado: Boolean(producto.destacado)
    };
}

function validar(valores) {
    const errores = {};
    if (!valores.nombre.trim()) errores.nombre = 'El nombre es obligatorio.';
    if (!valores.categoria.trim()) errores.categoria = 'La categoría es obligatoria.';

    if (valores.precio.trim() === '') {
        errores.precio = 'El precio es obligatorio.';
    } else if (!(Number(valores.precio) >= 0)) {
        errores.precio = 'Ingresá un precio válido (0 o más).';
    }

    if (valores.stock.trim() !== '' && !(Number.isInteger(Number(valores.stock)) && Number(valores.stock) >= 0)) {
        errores.stock = 'El stock tiene que ser un número entero (0 o más).';
    }
    return errores;
}

// Formulario controlado para crear y editar productos.
// onSubmit recibe los datos listos para mandar a la API y tiene que devolver una promesa:
// si la promesa falla, se muestra el mensaje de error del servidor.
export default function ProductForm({ producto, categorias = [], textoBoton, onSubmit, onCancelar }) {
    const [valores, setValores] = useState(() => valoresDesdeProducto(producto));
    const [errores, setErrores] = useState({});
    const [enviando, setEnviando] = useState(false);
    const [errorServidor, setErrorServidor] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setValores((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        // Se limpia el error del campo mientras se escribe
        setErrores((prev) => ({ ...prev, [name]: undefined }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const nuevosErrores = validar(valores);
        setErrores(nuevosErrores);
        if (Object.keys(nuevosErrores).length > 0) return;

        setEnviando(true);
        setErrorServidor(null);
        try {
            await onSubmit({
                nombre: valores.nombre.trim(),
                categoria: valores.categoria.trim(),
                precio: Number(valores.precio),
                stock: valores.stock.trim() === '' ? 0 : Number(valores.stock),
                imagenUrl: valores.imagenUrl.trim(),
                descripcion: valores.descripcion.trim(),
                destacado: valores.destacado
            });
            // Si salió bien, la página que usa el form navega a otra ruta
        } catch (err) {
            setErrorServidor(err.message || 'No se pudo guardar el producto.');
            setEnviando(false);
        }
    };

    const claseCampo = (campo) => `form-producto__campo ${errores[campo] ? 'form-producto__campo--error' : ''}`;

    return (
        <form className="form-producto" onSubmit={handleSubmit} noValidate>
            {errorServidor && (
                <p className="form-producto__alerta" role="alert">
                    {errorServidor}
                </p>
            )}

            <div className={claseCampo('nombre')}>
                <label htmlFor="producto-nombre">Nombre *</label>
                <input
                    id="producto-nombre"
                    name="nombre"
                    type="text"
                    placeholder="Ej: Mesa Comedor Pampa"
                    value={valores.nombre}
                    onChange={handleChange}
                    aria-invalid={Boolean(errores.nombre)}
                />
                {errores.nombre && <span className="form-producto__error">{errores.nombre}</span>}
            </div>

            <div className={claseCampo('categoria')}>
                <label htmlFor="producto-categoria">Categoría *</label>
                <input
                    id="producto-categoria"
                    name="categoria"
                    type="text"
                    list="categorias-existentes"
                    placeholder="Ej: Living"
                    value={valores.categoria}
                    onChange={handleChange}
                    aria-invalid={Boolean(errores.categoria)}
                />
                {/* Sugiere las categorías que ya existen, pero se puede escribir una nueva */}
                <datalist id="categorias-existentes">
                    {categorias.map((categoria) => (
                        <option key={categoria} value={categoria} />
                    ))}
                </datalist>
                {errores.categoria && <span className="form-producto__error">{errores.categoria}</span>}
            </div>

            <div className="form-producto__fila">
                <div className={claseCampo('precio')}>
                    <label htmlFor="producto-precio">Precio (ARS) *</label>
                    <input
                        id="producto-precio"
                        name="precio"
                        type="number"
                        min="0"
                        step="any"
                        inputMode="decimal"
                        placeholder="0"
                        value={valores.precio}
                        onChange={handleChange}
                        aria-invalid={Boolean(errores.precio)}
                    />
                    {errores.precio && <span className="form-producto__error">{errores.precio}</span>}
                </div>

                <div className={claseCampo('stock')}>
                    <label htmlFor="producto-stock">Stock</label>
                    <input
                        id="producto-stock"
                        name="stock"
                        type="number"
                        min="0"
                        step="1"
                        inputMode="numeric"
                        placeholder="0"
                        value={valores.stock}
                        onChange={handleChange}
                        aria-invalid={Boolean(errores.stock)}
                    />
                    {errores.stock && <span className="form-producto__error">{errores.stock}</span>}
                </div>
            </div>

            <div className="form-producto__campo">
                <label htmlFor="producto-imagen">URL de la imagen</label>
                <div className="form-producto__imagen">
                    <input
                        id="producto-imagen"
                        name="imagenUrl"
                        type="text"
                        placeholder="https://… o assets/img/productos/…"
                        value={valores.imagenUrl}
                        onChange={handleChange}
                    />
                    <img
                        className="form-producto__preview"
                        src={rutaImagen(valores.imagenUrl)}
                        alt="Vista previa"
                    />
                </div>
            </div>

            <div className="form-producto__campo">
                <label htmlFor="producto-descripcion">Descripción</label>
                <textarea
                    id="producto-descripcion"
                    name="descripcion"
                    rows="4"
                    placeholder="Materiales, medidas, terminaciones…"
                    value={valores.descripcion}
                    onChange={handleChange}
                />
            </div>

            <label className="form-producto__check">
                <input
                    type="checkbox"
                    name="destacado"
                    checked={valores.destacado}
                    onChange={handleChange}
                />
                Mostrar en "Piezas Destacadas" del inicio
            </label>

            <div className="form-producto__acciones">
                {onCancelar && (
                    <button
                        type="button"
                        className="form-producto__boton form-producto__boton--secundario"
                        onClick={onCancelar}
                        disabled={enviando}
                    >
                        Cancelar
                    </button>
                )}
                <button type="submit" className="form-producto__boton" disabled={enviando}>
                    {enviando ? 'Guardando…' : textoBoton}
                </button>
            </div>
        </form>
    );
}
