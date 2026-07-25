import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatearPrecio(valor: number) {
    return new Intl.NumberFormat("es-PE", {
        style: "currency",
        currency: "PEN",
        minimumFractionDigits: 2,
    }).format(valor);
}

export function ofertaEstaActiva(
    fechaInicio: string,
    fechaFin: string,
    activaManual?: boolean
) {
    if (activaManual === false) return false;
    if (activaManual === true) return true;
    const ahora = new Date();
    return ahora >= new Date(fechaInicio) && ahora <= new Date(fechaFin);
}