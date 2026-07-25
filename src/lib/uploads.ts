import { api } from "@/lib/api";

function leerComoBase64(archivo: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const lector = new FileReader();
        lector.onload = () => resolve(lector.result as string);
        lector.onerror = () => reject(new Error("No se pudo leer el archivo"));
        lector.readAsDataURL(archivo);
    });
}

export async function subirImagen(archivo: File, token: string): Promise<string> {
    const base64 = await leerComoBase64(archivo);
    const { url } = await api.post<{ url: string }>("/uploads", { imagen: base64 }, token);
    return url;
}
