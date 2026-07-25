import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import type { CategoriaProducto } from "@/types";

export function useCategorias() {
    const [categorias, setCategorias] = useState<CategoriaProducto[]>([]);
    const [cargando, setCargando] = useState(true);

    const cargar = useCallback(() => {
        setCargando(true);
        api
            .get<CategoriaProducto[]>("/categorias")
            .then(setCategorias)
            .finally(() => setCargando(false));
    }, []);

    useEffect(() => {
        cargar();
    }, [cargar]);

    return { categorias, cargando, recargar: cargar };
}