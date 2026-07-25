import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import type { Producto } from "@/types";
import { formatearPrecio, cn } from "@/lib/utils";
import { optimizarImagen } from "@/lib/imagenes";
import Badge from "@/components/ui/Badge";
import { useCartStore } from "@/store/useCartStore";
import { usePrefiereMenosMovimiento } from "@/lib/useMotionSeguro";
import QuickAddModal from "@/components/ui/QuickAddModal";

const AUTOPLAY_MS = 2200;

export default function ProductCard({ producto }: { producto: Producto }) {
    const enOferta = producto.precioOferta !== undefined;
    const agotado = producto.stock === 0;
    const agregarItem = useCartStore((s) => s.agregarItem);
    const prefiereMenosMovimiento = usePrefiereMenosMovimiento();
    const [vistaRapidaAbierta, setVistaRapidaAbierta] = useState(false);

    const tieneVariantesColor = producto.colores.length >= 2;
    const [colorActivoIdx, setColorActivoIdx] = useState(0);
    const [indiceImagen, setIndiceImagen] = useState(0);
    const [carruselPausado, setCarruselPausado] = useState(false);

    const colorActivo = tieneVariantesColor ? producto.colores[colorActivoIdx] : undefined;

    const imagenesActuales = useMemo(() => {
        const base = colorActivo?.imagen ? [colorActivo.imagen, ...producto.imagenes] : producto.imagenes;
        return Array.from(new Set(base.filter(Boolean)));
    }, [colorActivo, producto.imagenes]);

    useEffect(() => {
        setIndiceImagen(0);
    }, [colorActivoIdx]);

    useEffect(() => {
        if (imagenesActuales.length <= 1 || carruselPausado || prefiereMenosMovimiento) return;
        const timer = setInterval(() => {
            setIndiceImagen((i) => (i + 1) % imagenesActuales.length);
        }, AUTOPLAY_MS);
        return () => clearInterval(timer);
    }, [imagenesActuales.length, carruselPausado, prefiereMenosMovimiento]);

    const manejarClickAgregar = () => {
        const variantUnica = producto.tallas.length === 1 && producto.colores.length === 1;
        if (variantUnica) {
            agregarItem(producto, producto.tallas[0], producto.colores[0].nombre, 1, { abrirCarrito: false });
            return;
        }
        setVistaRapidaAbierta(true);
    };

    return (
        <div className="group">
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-fay-surface">
                <Link to={`/productos/${producto.slug}`} aria-label={producto.nombre} className="absolute inset-0">
                    <img
                        src={optimizarImagen(imagenesActuales[indiceImagen] ?? producto.imagenes[0], { ancho: 500 })}
                        alt={producto.nombre}
                        loading="lazy"
                        className={cn(
                            "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105",
                            agotado && "opacity-60"
                        )}
                    />
                </Link>

                {agotado ? (
                    <Badge variant="muted" className="pointer-events-none absolute left-3 top-3 z-10">
                        AGOTADO
                    </Badge>
                ) : (
                    <>
                        {producto.nuevo && (
                            <Badge variant="neutral" className="pointer-events-none absolute left-3 top-3 z-10">
                                NUEVO
                            </Badge>
                        )}
                        {enOferta && (
                            <Badge variant="accent" className="pointer-events-none absolute right-3 top-3 z-10">
                                OFERTA
                            </Badge>
                        )}
                        <button
                            aria-label="Agregar al carrito"
                            onClick={manejarClickAgregar}
                            className="absolute bottom-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white text-fay-black shadow-lg transition-transform hover:scale-110 active:scale-95"
                        >
                            <ShoppingBag size={16} />
                        </button>
                    </>
                )}

                {imagenesActuales.length > 1 && (
                    <div className="pointer-events-none absolute inset-x-0 bottom-2 z-10 flex justify-center gap-1">
                        {imagenesActuales.map((_, i) => (
                            <span
                                key={i}
                                className={cn(
                                    "h-1 w-1 rounded-full transition-all",
                                    i === indiceImagen ? "w-3 bg-white" : "bg-white/50"
                                )}
                            />
                        ))}
                    </div>
                )}
            </div>

            {tieneVariantesColor && (
                <div
                    className="mt-2 flex flex-wrap gap-1.5"
                    onMouseEnter={() => setCarruselPausado(true)}
                    onMouseLeave={() => setCarruselPausado(false)}
                >
                    {producto.colores.map((color, i) => (
                        <button
                            key={color.nombre}
                            onClick={() => setColorActivoIdx(i)}
                            aria-label={color.nombre}
                            title={color.nombre}
                            className={cn(
                                "h-4 w-4 rounded-full border-2 transition-all",
                                i === colorActivoIdx ? "border-fay-accent scale-110" : "border-fay-border"
                            )}
                            style={{ backgroundColor: color.hex }}
                        />
                    ))}
                </div>
            )}

            <Link to={`/productos/${producto.slug}`} className={cn("block", tieneVariantesColor ? "mt-1.5" : "mt-3")}>
                <p className="text-sm text-white">{producto.nombre}</p>
                <div className="mt-1 flex items-center gap-2">
                    <span className="text-sm font-medium">
                        {formatearPrecio(producto.precioOferta ?? producto.precio)}
                    </span>
                    {enOferta && (
                        <span className="text-xs text-fay-gray line-through">
                            {formatearPrecio(producto.precio)}
                        </span>
                    )}
                </div>
            </Link>

            <AnimatePresence>
                {vistaRapidaAbierta && (
                    <QuickAddModal producto={producto} onCerrar={() => setVistaRapidaAbierta(false)} />
                )}
            </AnimatePresence>
        </div>
    );
}
