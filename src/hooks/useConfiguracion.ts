import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Configuracion } from "@/types";

export function useConfiguracion() {
    const [configuracion, setConfiguracion] = useState<Configuracion | null>(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        api
            .get<Configuracion>("/configuracion")
            .then(setConfiguracion)
            .catch(() => setConfiguracion(null))
            .finally(() => setCargando(false));
    }, []);

    return { configuracion, cargando };
}
