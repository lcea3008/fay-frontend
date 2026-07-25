import { Link } from "react-router-dom";
import type { Oferta } from "@/types";
import { optimizarImagen } from "@/lib/imagenes";
import Badge from "@/components/ui/Badge";

export default function OfertaCard({ oferta }: { oferta: Oferta }) {
    const fechaFormateada = new Date(oferta.fechaFin).toLocaleDateString("es-PE", {
        day: "numeric",
        month: "short",
    });

    return (
        <Link
            to={oferta.categoriaRelacionada ? `/productos?categoria=${oferta.categoriaRelacionada}` : "/productos"}
            className="group block overflow-hidden rounded-xl border border-fay-border bg-fay-surface"
        >
            <div className="relative aspect-[16/9] overflow-hidden">
                <img
                    src={optimizarImagen(oferta.imagen, { ancho: 600 })}
                    alt={oferta.titulo}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {oferta.descuento > 0 && (
                    <Badge variant="accent" className="absolute right-3 top-3 text-xs">
                        -{oferta.descuento}%
                    </Badge>
                )}
            </div>
            <div className="p-4">
                <p className="text-sm font-medium text-white">{oferta.titulo}</p>
                <p className="mt-1 text-xs leading-relaxed text-fay-gray">{oferta.descripcion}</p>
                <p className="mt-3 text-xs text-fay-accent-light">Válido hasta el {fechaFormateada}</p>
            </div>
        </Link>
    );
}
