import { BadgePercent } from "lucide-react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import OfertaCard from "@/components/ui/OfertaCard";
import { useOfertasActivas } from "@/hooks/useOfertasActivas";

export default function Ofertas() {
    const { ofertas, cargando } = useOfertasActivas();

    return (
        <main className="mx-auto max-w-7xl px-5 py-12 md:px-8">
            <Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Ofertas" }]} />

            <h1 className="mt-3 text-3xl font-semibold">Ofertas</h1>
            <p className="mt-2 text-sm text-fay-gray">Descuentos y promociones activas por tiempo limitado.</p>

            {cargando ? (
                <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="aspect-[16/9] rounded-xl bg-fay-surface" />
                            <div className="mt-3 h-3.5 w-2/3 rounded bg-fay-surface" />
                            <div className="mt-2 h-3 w-full rounded bg-fay-surface" />
                        </div>
                    ))}
                </div>
            ) : ofertas.length === 0 ? (
                <div className="mt-16 flex flex-col items-center text-center">
                    <BadgePercent size={28} className="text-fay-gray" />
                    <p className="mt-4 text-sm text-fay-gray">
                        No hay ofertas activas por ahora. Vuelve pronto.
                    </p>
                </div>
            ) : (
                <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {ofertas.map((oferta) => (
                        <OfertaCard key={oferta.id} oferta={oferta} />
                    ))}
                </div>
            )}
        </main>
    );
}
