import { useEffect, useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useOfertasActivas } from "@/hooks/useOfertasActivas";
import { usePrefiereMenosMovimiento } from "@/lib/useMotionSeguro";
import { optimizarImagen } from "@/lib/imagenes";
import { LinkButton } from "@/components/ui/Button";

const AUTOPLAY_MS = 5000;

export default function OfertasBanner() {
    const { ofertas: ofertasActivas, cargando } = useOfertasActivas();
    const prefiereMenosMovimiento = usePrefiereMenosMovimiento();

    const [indice, setIndice] = useState(0);
    const [pausado, setPausado] = useState(false);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const esCarrusel = ofertasActivas.length > 1;

    const avanzar = useCallback(() => {
        setIndice((i) => (i + 1) % ofertasActivas.length);
    }, [ofertasActivas.length]);

    const retroceder = useCallback(() => {
        setIndice((i) => (i - 1 + ofertasActivas.length) % ofertasActivas.length);
    }, [ofertasActivas.length]);

    useEffect(() => {
        if (!esCarrusel || pausado || prefiereMenosMovimiento) return;
        timerRef.current = setInterval(avanzar, AUTOPLAY_MS);
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [esCarrusel, pausado, avanzar, prefiereMenosMovimiento]);

    // Mientras carga o si no hay ofertas activas, no se renderiza nada.
    if (cargando || ofertasActivas.length === 0) return null;

    const oferta = ofertasActivas[indice];

    return (
        <section
            className="mx-auto mt-6 max-w-7xl px-5 md:px-8"
            onMouseEnter={() => setPausado(true)}
            onMouseLeave={() => setPausado(false)}
            aria-label="Ofertas activas"
        >
            <div className="relative overflow-hidden rounded-2xl border border-fay-accent/40 bg-gradient-to-r from-fay-accent-tint via-fay-accent-tint/80 to-fay-accent-tint shadow-lg shadow-fay-accent/10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={oferta.id}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.4 }}
                        className="grid items-center gap-4 p-5 md:grid-cols-[auto_1fr_auto] md:p-6"
                    >
                        <div className="relative hidden h-16 w-24 overflow-hidden rounded-lg md:block">
                            <img src={optimizarImagen(oferta.imagen, { ancho: 150 })} alt="" className="h-full w-full object-cover" />
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="h-2 w-2 shrink-0 rounded-full bg-fay-accent" />
                            <div>
                                <p className="text-sm font-medium text-fay-accent-light md:text-base">
                                    {oferta.titulo}
                                </p>
                                <p className="hidden text-xs text-fay-gray md:block">{oferta.descripcion}</p>
                            </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-3">
                            <Link
                                to="/ofertas"
                                className="text-xs text-fay-accent-light transition-colors hover:text-white"
                            >
                                Ver más
                            </Link>
                            <LinkButton
                                to={oferta.categoriaRelacionada ? `/productos?categoria=${oferta.categoriaRelacionada}` : "/productos"}
                                size="sm"
                                className="w-fit"
                            >
                                Ver oferta
                            </LinkButton>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {esCarrusel && (
                    <div className="flex items-center justify-center gap-4 border-t border-fay-accent/20 px-5 py-2.5">
                        <button aria-label="Oferta anterior" onClick={retroceder} className="text-fay-gray transition-colors hover:text-white">
                            <ChevronLeft size={16} />
                        </button>
                        <div className="flex gap-1.5">
                            {ofertasActivas.map((o, i) => (
                                <button
                                    key={o.id}
                                    aria-label={`Ir a la oferta ${i + 1}`}
                                    onClick={() => setIndice(i)}
                                    className={`h-1.5 rounded-full transition-all ${i === indice ? "w-5 bg-fay-accent" : "w-1.5 bg-fay-gray/40"
                                        }`}
                                />
                            ))}
                        </div>
                        <button aria-label="Siguiente oferta" onClick={avanzar} className="text-fay-gray transition-colors hover:text-white">
                            <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
