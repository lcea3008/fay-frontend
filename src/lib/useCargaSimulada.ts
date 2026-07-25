import { useEffect, useState } from "react";

/**
 * Simula un pequeño delay de carga mientras no existe backend real.
 * Cuando conectemos Express, este hook se reemplaza por el estado
 * "loading" real de la petición (ej. de React Query o un useEffect con fetch).
 */
export function useCargaSimulada(ms = 500) {
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => setCargando(false), ms);
        return () => clearTimeout(timeout);
    }, [ms]);

    return cargando;
}