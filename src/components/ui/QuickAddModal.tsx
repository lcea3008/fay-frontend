import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { Producto } from "@/types";
import { useCartStore } from "@/store/useCartStore";
import { formatearPrecio, cn } from "@/lib/utils";
import { optimizarImagen } from "@/lib/imagenes";
import Chip from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";

interface Props {
    producto: Producto;
    onCerrar: () => void;
}

export default function QuickAddModal({ producto, onCerrar }: Props) {
    const agregarItem = useCartStore((s) => s.agregarItem);
    const [talla, setTalla] = useState<string | null>(null);
    const [color, setColor] = useState<string | null>(null);
    const [error, setError] = useState("");

    const manejarAgregar = () => {
        if (!talla || !color) {
            setError("Selecciona talla y color.");
            return;
        }
        agregarItem(producto, talla, color, 1, { abrirCarrito: false });
        onCerrar();
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onCerrar}
                className="fixed inset-0 z-50 bg-black/60"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2.5rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl border border-fay-border bg-fay-surface p-6"
            >
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-base font-medium">Agregar al carrito</h2>
                    <button onClick={onCerrar} className="text-fay-gray hover:text-white">
                        <X size={18} />
                    </button>
                </div>

                <div className="flex gap-3">
                    <div className="h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-fay-black">
                        <img src={optimizarImagen(producto.imagenes[0], { ancho: 100 })} alt="" className="h-full w-full object-cover" />
                    </div>
                    <div>
                        <p className="text-sm">{producto.nombre}</p>
                        <p className="mt-1 text-sm font-medium">
                            {formatearPrecio(producto.precioOferta ?? producto.precio)}
                        </p>
                    </div>
                </div>

                <div className="mt-5">
                    <p className="mb-2 text-xs text-fay-gray">Talla</p>
                    <div className="flex flex-wrap gap-2">
                        {producto.tallas.map((t) => (
                            <Chip key={t} size="sm" active={talla === t} onClick={() => setTalla(t)}>
                                {t}
                            </Chip>
                        ))}
                    </div>
                </div>

                <div className="mt-4">
                    <p className="mb-2 text-xs text-fay-gray">Color</p>
                    <div className="flex flex-wrap gap-2">
                        {producto.colores.map((c) => (
                            <button
                                key={c.nombre}
                                onClick={() => setColor(c.nombre)}
                                aria-label={c.nombre}
                                title={c.nombre}
                                className={cn(
                                    "h-7 w-7 rounded-full border-2 transition-all",
                                    color === c.nombre ? "border-fay-accent scale-110" : "border-fay-border"
                                )}
                                style={{ backgroundColor: c.hex }}
                            />
                        ))}
                    </div>
                </div>

                {error && <p className="mt-3 text-xs text-fay-danger-light">{error}</p>}

                <Button onClick={manejarAgregar} fullWidth className="mt-6">
                    Agregar al carrito
                </Button>
            </motion.div>
        </>
    );
}
