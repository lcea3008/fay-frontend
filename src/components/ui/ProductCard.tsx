import { Link } from "react-router-dom";
import type { Producto } from "@/types";
import { formatearPrecio, cn } from "@/lib/utils";

export default function ProductCard({ producto }: { producto: Producto }) {
    const enOferta = producto.precioOferta !== undefined;
    const agotado = producto.stock === 0;

    return (
        <Link to={`/productos/${producto.slug}`} className="group block">
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-fay-surface">
                <img
                    src={producto.imagenes[0]}
                    alt={producto.nombre}
                    className={cn(
                        "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105",
                        agotado && "opacity-60"
                    )}
                />
                {agotado ? (
                    <span className="absolute left-3 top-3 rounded-md bg-fay-black/80 px-2 py-1 text-[10px] font-medium text-fay-gray">
                        AGOTADO
                    </span>
                ) : (
                    <>
                        {producto.nuevo && (
                            <span className="absolute left-3 top-3 rounded-md bg-white px-2 py-1 text-[10px] font-medium text-fay-black">
                                NUEVO
                            </span>
                        )}
                        {enOferta && (
                            <span className="absolute right-3 top-3 rounded-md bg-fay-accent px-2 py-1 text-[10px] font-medium text-white">
                                OFERTA
                            </span>
                        )}
                    </>
                )}
            </div>
            <div className="mt-3">
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
            </div>
        </Link>
    );
}