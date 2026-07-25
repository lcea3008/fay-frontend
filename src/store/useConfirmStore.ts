import { create } from "zustand";

interface ConfirmState {
    abierto: boolean;
    titulo: string;
    mensaje: string;
    textoConfirmar: string;
    resolver: ((valor: boolean) => void) | null;
    confirmar: (mensaje: string, opciones?: { titulo?: string; textoConfirmar?: string }) => Promise<boolean>;
    responder: (valor: boolean) => void;
}

export const useConfirmStore = create<ConfirmState>((set, get) => ({
    abierto: false,
    titulo: "Confirmar acción",
    mensaje: "",
    textoConfirmar: "Eliminar",
    resolver: null,

    confirmar: (mensaje, opciones) => {
        return new Promise<boolean>((resolve) => {
            set({
                abierto: true,
                mensaje,
                titulo: opciones?.titulo ?? "Confirmar acción",
                textoConfirmar: opciones?.textoConfirmar ?? "Eliminar",
                resolver: resolve,
            });
        });
    },

    responder: (valor) => {
        get().resolver?.(valor);
        set({ abierto: false, resolver: null });
    },
}));

export function confirmarAccion(
    mensaje: string,
    opciones?: { titulo?: string; textoConfirmar?: string }
): Promise<boolean> {
    return useConfirmStore.getState().confirmar(mensaje, opciones);
}
