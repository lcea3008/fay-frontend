import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import ProductCardSkeleton from "@/components/ui/ProductCardSkeleton";
import { useProductos } from "@/hooks/useProductos";

export default function ProductosDestacados() {
    const { productos: destacados, cargando } = useProductos({ destacado: true });

    return (
        <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
            <div className="mb-8 flex items-end justify-between">
                <div>
                    <p className="mb-1 text-xs font-medium tracking-[0.2em] text-fay-accent-light">
                        DESTACADOS
                    </p>
                    <h2 className="text-2xl font-semibold md:text-3xl">
                        Lo más querido de la temporada
                    </h2>
                </div>
                <Link
                    to="/productos"
                    className="hidden items-center gap-1 text-sm text-fay-gray transition-colors hover:text-white md:flex"
                >
                    Ver todo <ArrowRight size={14} />
                </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
                {cargando
                    ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
                    : destacados.map((producto) => <ProductCard key={producto.id} producto={producto} />)}
            </div>
        </section>
    );
}