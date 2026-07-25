import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Producto } from "@/types";

export function useProducto(slug: string | undefined) {
    const [producto, setProducto] = useState<Producto | null>(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!slug) return;
        setCargando(true);
        api
            .get<Producto>(`/productos/${slug}`)
            .then(setProducto)
            .catch((e) => setError(e.message))
            .finally(() => setCargando(false));
    }, [slug]);

    return { producto, cargando, error };
}