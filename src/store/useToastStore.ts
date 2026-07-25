import { create } from "zustand";

export type TipoToast = "error" | "exito" | "info";

interface Toast {
    id: number;
    mensaje: string;
    tipo: TipoToast;
}

interface ToastState {
    toasts: Toast[];
    mostrar: (mensaje: string, tipo?: TipoToast) => void;
    quitar: (id: number) => void;
}

let siguienteId = 0;

export const useToastStore = create<ToastState>((set, get) => ({
    toasts: [],

    mostrar: (mensaje, tipo = "info") => {
        const id = siguienteId++;
        set({ toasts: [...get().toasts, { id, mensaje, tipo }] });
        setTimeout(() => get().quitar(id), 3500);
    },

    quitar: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}));

export function mostrarToast(mensaje: string, tipo: TipoToast = "info") {
    useToastStore.getState().mostrar(mensaje, tipo);
}
