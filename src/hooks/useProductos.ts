import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Producto } from "@/types";

interface FiltrosProductos {
    categoria?: string;
    destacado?: boolean;
    buscar?: string;
}

export function useProductos(filtros: FiltrosProductos = {}) {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const params = new URLSearchParams();
        if (filtros.categoria) params.set("categoria", filtros.categoria);
        if (filtros.destacado) params.set("destacado", "true");
        if (filtros.buscar) params.set("buscar", filtros.buscar);

        setCargando(true);
        api
            .get<Producto[]>(`/productos?${params.toString()}`)
            .then(setProductos)
            .catch((e) => setError(e.message))
            .finally(() => setCargando(false));
    }, [filtros.categoria, filtros.destacado, filtros.buscar]);

    return { productos, cargando, error };
}