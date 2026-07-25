import { create } from "zustand";
import type { Producto } from "@/types";
import { api } from "@/lib/api";

interface ProductosAdminState {
    productos: Producto[];
    cargando: boolean;
    error: string | null;
    cargarProductos: () => Promise<void>;
    crearProducto: (producto: Omit<Producto, "id">, token: string) => Promise<void>;
    actualizarProducto: (id: string, datos: Partial<Producto>, token: string) => Promise<void>;
    eliminarProducto: (id: string, token: string) => Promise<void>;
}

export const useProductosAdminStore = create<ProductosAdminState>((set, get) => ({
    productos: [],
    cargando: false,
    error: null,

    cargarProductos: async () => {
        set({ cargando: true, error: null });
        try {
            const productos = await api.get<Producto[]>("/productos");
            set({ productos });
        } catch (e) {
            set({ error: e instanceof Error ? e.message : "Error al cargar productos" });
        } finally {
            set({ cargando: false });
        }
    },

    crearProducto: async (producto, token) => {
        const nuevo = await api.post<Producto>("/productos", producto, token);
        set({ productos: [nuevo, ...get().productos] });
    },

    actualizarProducto: async (id, datos, token) => {
        const actualizado = await api.put<Producto>(`/productos/${id}`, datos, token);
        set({
            productos: get().productos.map((p) => (p.id === id ? actualizado : p)),
        });
    },

    eliminarProducto: async (id, token) => {
        await api.delete(`/productos/${id}`, token);
        set({ productos: get().productos.filter((p) => p.id !== id) });
    },
}));