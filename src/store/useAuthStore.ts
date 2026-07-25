import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "@/lib/api";
import type { Usuario } from "@/types";

interface AuthState {
    usuario: Usuario | null;
    token: string | null;
    refreshToken: string | null;
    estaAutenticado: boolean;
    iniciarSesion: (email: string, password: string) => Promise<boolean>;
    cerrarSesion: () => void;
    refrescarToken: () => Promise<string | null>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            usuario: null,
            token: null,
            refreshToken: null,
            estaAutenticado: false,

            iniciarSesion: async (email, password) => {
                try {
                    const respuesta = await api.post<{ token: string; refreshToken: string; usuario: Usuario }>(
                        "/auth/login",
                        { email, password }
                    );
                    set({
                        usuario: respuesta.usuario,
                        token: respuesta.token,
                        refreshToken: respuesta.refreshToken,
                        estaAutenticado: true,
                    });
                    return true;
                } catch {
                    return false;
                }
            },

            cerrarSesion: () => set({ usuario: null, token: null, refreshToken: null, estaAutenticado: false }),

            refrescarToken: async () => {
                const refreshToken = get().refreshToken;
                if (!refreshToken) {
                    get().cerrarSesion();
                    return null;
                }

                try {
                    const API_URL = import.meta.env.VITE_API_URL;
                    const respuesta = await fetch(`${API_URL}/auth/refresh`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ refreshToken }),
                    });

                    if (!respuesta.ok) throw new Error();

                    const { token } = await respuesta.json();
                    set({ token });
                    return token;
                } catch {
                    get().cerrarSesion();
                    return null;
                }
            },
        }),
        { name: "fay-auth" }
    )
);