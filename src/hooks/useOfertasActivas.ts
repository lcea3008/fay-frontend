import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Oferta } from "@/types";

export function useOfertasActivas() {
    const [ofertas, setOfertas] = useState<Oferta[]>([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        api
            .get<Oferta[]>("/ofertas/activas")
            .then(setOfertas)
            .catch(() => setOfertas([]))
            .finally(() => setCargando(false));
    }, []);

    return { ofertas, cargando };
}