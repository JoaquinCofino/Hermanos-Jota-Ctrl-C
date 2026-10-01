const formateador = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
});

export function formatearPrecio(precio) {
    return formateador.format(precio);
}
