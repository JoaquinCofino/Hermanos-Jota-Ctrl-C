import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);

// Clave nueva: la anterior guardaba ids sueltos y este carrito guarda objetos.
const CARRITO_KEY = 'hj_carrito_v2';

function leerCarrito() {
    try {
        const guardado = JSON.parse(localStorage.getItem(CARRITO_KEY));
        return Array.isArray(guardado) ? guardado : [];
    } catch {
        return [];
    }
}

export function CartProvider({ children }) {
    const [carrito, setCarrito] = useState(leerCarrito);

    useEffect(() => {
        try {
            localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
        } catch {
            // Si localStorage falla, el carrito sigue funcionando en memoria.
        }
    }, [carrito]);

    function agregar(producto) {
        setCarrito((actual) => {
            const existe = actual.find((item) => item.id === producto.id);

            if (existe) {
                return actual.map((item) =>
                    item.id === producto.id
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                );
            }

            return [
                ...actual,
                {
                    id: producto.id,
                    nombre: producto.nombre,
                    precio: producto.precio,
                    imagenUrl: producto.imagenUrl,
                    cantidad: 1
                }
            ];
        });
    }

    function restar(id) {
        setCarrito((actual) =>
            actual
                .map((item) =>
                    item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item
                )
                .filter((item) => item.cantidad > 0)
        );
    }

    function quitar(id) {
        setCarrito((actual) => actual.filter((item) => item.id !== id));
    }

    function vaciar() {
        setCarrito([]);
    }

    const cantidadTotal = carrito.reduce((suma, item) => suma + item.cantidad, 0);
    const total = carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0);

    const valor = { carrito, agregar, restar, quitar, vaciar, cantidadTotal, total };

    return <CartContext.Provider value={valor}>{children}</CartContext.Provider>;
}

export function useCart() {
    return useContext(CartContext);
}
