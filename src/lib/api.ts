import { useAuthStore } from "@/store/useAuthStore";

const API_URL = import.meta.env.VITE_API_URL;

interface OpcionesFetch extends RequestInit {
    token?: string;
    _reintentado?: boolean;
}

async function apiFetch<T>(endpoint: string, opciones: OpcionesFetch = {}): Promise<T> {
    const { token, headers, _reintentado, ...resto } = opciones;

    const respuesta = await fetch(`${API_URL}${endpoint}`, {
        ...resto,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...headers,
        },
    });

    if (respuesta.status === 401 && token && !_reintentado) {
        const nuevoToken = await useAuthStore.getState().refrescarToken();
        if (nuevoToken) {
            return apiFetch<T>(endpoint, { ...opciones, token: nuevoToken, _reintentado: true });
        }
    }

    if (!respuesta.ok) {
        const error = await respuesta.json().catch(() => ({ mensaje: "Error desconocido" }));
        throw new Error(error.mensaje || `Error ${respuesta.status}`);
    }

    if (respuesta.status === 204) return undefined as T;

    return respuesta.json();
}

export const api = {
    get: <T>(endpoint: string, token?: string) => apiFetch<T>(endpoint, { method: "GET", token }),
    post: <T>(endpoint: string, body: unknown, token?: string) =>
        apiFetch<T>(endpoint, { method: "POST", body: JSON.stringify(body), token }),
    put: <T>(endpoint: string, body: unknown, token?: string) =>
        apiFetch<T>(endpoint, { method: "PUT", body: JSON.stringify(body), token }),
    delete: <T>(endpoint: string, token?: string) => apiFetch<T>(endpoint, { method: "DELETE", token }),
};