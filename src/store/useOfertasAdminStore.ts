import { create } from "zustand";
import type { Oferta } from "@/types";
import { api } from "@/lib/api";

interface OfertasAdminState {
    ofertas: Oferta[];
    cargando: boolean;
    error: string | null;
    cargarOfertas: () => Promise<void>;
    crearOferta: (oferta: Omit<Oferta, "id">, token: string) => Promise<void>;
    actualizarOferta: (id: string, datos: Partial<Oferta>, token: string) => Promise<void>;
    eliminarOferta: (id: string, token: string) => Promise<void>;
}

export const useOfertasAdminStore = create<OfertasAdminState>((set, get) => ({
    ofertas: [],
    cargando: false,
    error: null,

    cargarOfertas: async () => {
        set({ cargando: true, error: null });
        try {
            const ofertas = await api.get<Oferta[]>("/ofertas");
            set({ ofertas });
        } catch (e) {
            set({ error: e instanceof Error ? e.message : "Error al cargar ofertas" });
        } finally {
            set({ cargando: false });
        }
    },

    crearOferta: async (oferta, token) => {
        const nueva = await api.post<Oferta>("/ofertas", oferta, token);
        set({ ofertas: [nueva, ...get().ofertas] });
    },

    actualizarOferta: async (id, datos, token) => {
        const actualizada = await api.put<Oferta>(`/ofertas/${id}`, datos, token);
        set({ ofertas: get().ofertas.map((o) => (o.id === id ? actualizada : o)) });
    },

    eliminarOferta: async (id, token) => {
        await api.delete(`/ofertas/${id}`, token);
        set({ ofertas: get().ofertas.filter((o) => o.id !== id) });
    },
}));