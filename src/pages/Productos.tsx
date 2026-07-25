import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Search, X, SearchX } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import ProductCardSkeleton from "@/components/ui/ProductCardSkeleton";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Chip from "@/components/ui/Chip";
import { Select } from "@/components/ui/Input";
import { useProductos } from "@/hooks/useProductos";
import { useCategorias } from "@/hooks/useCategorias";

type Orden = "" | "precio-asc" | "precio-desc";

export default function Productos() {
    const [searchParams, setSearchParams] = useSearchParams();
    const categoriaActiva = searchParams.get("categoria") ?? "";
    const busqueda = searchParams.get("buscar") ?? "";

    const { categorias } = useCategorias();
    const { productos, cargando, error } = useProductos({
        categoria: categoriaActiva || undefined,
        buscar: busqueda || undefined,
    });

    const [orden, setOrden] = useState<Orden>("");
    const [inputBusqueda, setInputBusqueda] = useState(busqueda);

    useEffect(() => {
        setInputBusqueda(busqueda);
    }, [busqueda]);

    useEffect(() => {
        if (inputBusqueda === busqueda) return;
        const timeout = setTimeout(() => {
            const params = new URLSearchParams(searchParams);
            if (inputBusqueda.trim()) {
                params.set("buscar", inputBusqueda.trim());
            } else {
                params.delete("buscar");
            }
            setSearchParams(params, { replace: true });
        }, 350);
        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputBusqueda]);

    const seleccionarCategoria = (slug: string) => {
        const params = new URLSearchParams(searchParams);
        if (slug) {
            params.set("categoria", slug);
        } else {
            params.delete("categoria");
        }
        setSearchParams(params);
    };

    const productosFiltrados = useMemo(() => {
        let resultado = productos;

        if (orden === "precio-asc") {
            resultado = [...resultado].sort(
                (a, b) => (a.precioOferta ?? a.precio) - (b.precioOferta ?? b.precio)
            );
        } else if (orden === "precio-desc") {
            resultado = [...resultado].sort(
                (a, b) => (b.precioOferta ?? b.precio) - (a.precioOferta ?? a.precio)
            );
        }

        return resultado;
    }, [productos, orden]);

    const categoriaNombre = categorias.find((c) => c.slug === categoriaActiva)?.nombre;
    const hayFiltrosExtra = busqueda.length > 0;

    const limpiarFiltros = () => {
        setInputBusqueda("");
        setSearchParams(new URLSearchParams());
    };

    const tituloPagina = categoriaNombre ? `${categoriaNombre} · FAY` : busqueda ? `"${busqueda}" · FAY` : "Productos · FAY";

    return (
        <main className="mx-auto max-w-7xl px-5 py-12 md:px-8">
            <Helmet>
                <title>{tituloPagina}</title>
                <meta
                    name="description"
                    content={
                        categoriaNombre
                            ? `Comprá ${categoriaNombre.toLowerCase()} para mujer en FAY — envío por WhatsApp.`
                            : "Todo el catálogo de ropa deportiva para mujer: leggings, tops, conjuntos y más."
                    }
                />
            </Helmet>
            <Breadcrumbs
                items={[
                    { label: "Inicio", to: "/" },
                    { label: "Productos", to: "/productos" },
                    ...(categoriaNombre ? [{ label: categoriaNombre }] : busqueda ? [{ label: `"${busqueda}"` }] : []),
                ]}
            />

            <h1 className="mt-3 text-3xl font-semibold">Productos</h1>

            <div className="mt-5 flex max-w-sm items-center gap-2 rounded-lg border border-fay-border bg-fay-surface px-3 py-2">
                <Search size={16} className="shrink-0 text-fay-gray" />
                <input
                    value={inputBusqueda}
                    onChange={(e) => setInputBusqueda(e.target.value)}
                    placeholder="Buscar productos..."
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-fay-gray"
                />
                {inputBusqueda && (
                    <button
                        aria-label="Limpiar búsqueda"
                        onClick={() => setInputBusqueda("")}
                        className="shrink-0 text-fay-gray hover:text-white"
                    >
                        <X size={15} />
                    </button>
                )}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
                <Chip active={!categoriaActiva} onClick={() => seleccionarCategoria("")}>
                    Todos
                </Chip>
                {categorias.map((c) => (
                    <Chip key={c.slug} active={categoriaActiva === c.slug} onClick={() => seleccionarCategoria(c.slug)}>
                        {c.nombre}
                    </Chip>
                ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-fay-gray">
                    {cargando
                        ? "Cargando…"
                        : `${productosFiltrados.length} producto${productosFiltrados.length === 1 ? "" : "s"} encontrado${productosFiltrados.length === 1 ? "" : "s"}`}
                    {hayFiltrosExtra && (
                        <button onClick={limpiarFiltros} className="ml-3 text-fay-accent-light hover:text-white">
                            Limpiar filtros
                        </button>
                    )}
                </p>

                <Select
                    value={orden}
                    onChange={(e) => setOrden(e.target.value as Orden)}
                    className="w-auto py-1.5"
                >
                    <option value="">Más recientes</option>
                    <option value="precio-asc">Precio: menor a mayor</option>
                    <option value="precio-desc">Precio: mayor a menor</option>
                </Select>
            </div>

            {error && <p className="mt-4 text-sm text-fay-danger-light">{error}</p>}

            {cargando ? (
                <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <ProductCardSkeleton key={i} />
                    ))}
                </div>
            ) : productosFiltrados.length === 0 ? (
                <div className="mt-16 flex flex-col items-center text-center">
                    <SearchX size={28} className="text-fay-gray" />
                    <p className="mt-4 text-sm text-fay-gray">
                        No encontramos productos con esos filtros. Prueba ajustando la búsqueda.
                    </p>
                </div>
            ) : (
                <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
                    {productosFiltrados.map((producto) => (
                        <ProductCard key={producto.id} producto={producto} />
                    ))}
                </div>
            )}
        </main>
    );
}
