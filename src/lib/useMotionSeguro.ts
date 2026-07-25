import { useEffect, useState } from "react";

/**
 * Devuelve true si el usuario configuró su sistema para reducir animaciones.
 * Úsalo para desactivar/simplificar animaciones de Framer Motion cuando aplique.
 */
export function usePrefiereMenosMovimiento() {
    const [prefiere, setPrefiere] = useState(false);

    useEffect(() => {
        const query = window.matchMedia("(prefers-reduced-motion: reduce)");
        setPrefiere(query.matches);
        const listener = (e: MediaQueryListEvent) => setPrefiere(e.matches);
        query.addEventListener("change", listener);
        return () => query.removeEventListener("change", listener);
    }, []);

    return prefiere;
}