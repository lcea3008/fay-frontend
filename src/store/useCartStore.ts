import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ItemCarrito, Producto } from "@/types";
import { api } from "@/lib/api";
import { mostrarToast } from "@/store/useToastStore";

interface OpcionesAgregar {
    abrirCarrito?: boolean;
}

interface CartState {
    items: ItemCarrito[];
    abierto: boolean;
    agregarItem: (producto: Producto, talla: string, color: string, cantidad?: number, opciones?: OpcionesAgregar) => void;
    quitarItem: (productoId: string, talla: string, color: string) => void;
    actualizarCantidad: (productoId: string, talla: string, color: string, cantidad: number) => void;
    vaciarCarrito: () => void;
    abrirCarrito: () => void;
    cerrarCarrito: () => void;
    total: () => number;
    cantidadTotal: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            abierto: false,

            agregarItem: (producto, talla, color, cantidad = 1, opciones = {}) => {
                const { abrirCarrito = true } = opciones;
                api.post(`/productos/${producto.id}/popularidad`, {}).catch(() => { });

                set((state) => {
                    const existente = state.items.find(
                        (i) => i.producto.id === producto.id && i.talla === talla && i.color === color
                    );
                    if (existente) {
                        return {
                            items: state.items.map((i) =>
                                i === existente ? { ...i, cantidad: i.cantidad + cantidad } : i
                            ),
                            abierto: abrirCarrito ? true : state.abierto,
                        };
                    }
                    return {
                        items: [...state.items, { producto, talla, color, cantidad }],
                        abierto: abrirCarrito ? true : state.abierto,
                    };
                });

                mostrarToast(`${producto.nombre} agregado al carrito`, "exito");
            },

            quitarItem: (productoId, talla, color) => {
                set((state) => ({
                    items: state.items.filter(
                        (i) => !(i.producto.id === productoId && i.talla === talla && i.color === color)
                    ),
                }));
            },

            actualizarCantidad: (productoId, talla, color, cantidad) => {
                set((state) => ({
                    items: state.items.map((i) =>
                        i.producto.id === productoId && i.talla === talla && i.color === color
                            ? { ...i, cantidad: Math.max(1, cantidad) }
                            : i
                    ),
                }));
            },

            vaciarCarrito: () => set({ items: [] }),
            abrirCarrito: () => set({ abierto: true }),
            cerrarCarrito: () => set({ abierto: false }),

            total: () =>
                get().items.reduce((acc, i) => {
                    const precio = i.producto.precioOferta ?? i.producto.precio;
                    return acc + precio * i.cantidad;
                }, 0),

            cantidadTotal: () => get().items.reduce((acc, i) => acc + i.cantidad, 0),
        }),
        {
            name: "fay-cart",
            partialize: (state) => ({ items: state.items }),
        }
    )
);