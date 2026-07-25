import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ItemCarrito, Producto } from "@/types";
import { api } from "@/lib/api";

interface CartState {
    items: ItemCarrito[];
    abierto: boolean;
    agregarItem: (producto: Producto, talla: string, color: string, cantidad?: number) => void;
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

            agregarItem: (producto, talla, color, cantidad = 1) => {
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
                            abierto: true,
                        };
                    }
                    return {
                        items: [...state.items, { producto, talla, color, cantidad }],
                        abierto: true,
                    };
                });
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