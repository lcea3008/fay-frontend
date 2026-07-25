import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, X, SearchX } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import ProductCardSkeleton from "@/components/ui/ProductCardSkeleton";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { useProductos } from "@/hooks/useProductos";
import { useCategorias } from "@/hooks/useCategorias";
import { cn } from "@/lib/utils";

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

    const [tallasSeleccionadas, setTallasSeleccionadas] = useState<string[]>([]);
    const [coloresSeleccionados, setColoresSeleccionados] = useState<string[]>([]);
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

    const toggleTalla = (talla: string) => {
        setTallasSeleccionadas((prev) =>
            prev.includes(talla) ? prev.filter((t) => t !== talla) : [...prev, talla]
        );
    };

    const toggleColor = (nombre: string) => {
        setColoresSeleccionados((prev) =>
            prev.includes(nombre) ? prev.filter((c) => c !== nombre) : [...prev, nombre]
        );
    };

    const tallasDisponibles = useMemo(() => {
        const set = new Set<string>();
        productos.forEach((p) => p.tallas.forEach((t) => set.add(t)));
        return Array.from(set).sort();
    }, [productos]);

    const coloresDisponibles = useMemo(() => {
        const mapa = new Map<string, string>();
        productos.forEach((p) => p.colores.forEach((c) => mapa.set(c.nombre, c.hex)));
        return Array.from(mapa.entries());
    }, [productos]);

    const productosFiltrados = useMemo(() => {
        let resultado = productos;

        if (tallasSeleccionadas.length > 0) {
            resultado = resultado.filter((p) => p.tallas.some((t) => tallasSeleccionadas.includes(t)));
        }
        if (coloresSeleccionados.length > 0) {
            resultado = resultado.filter((p) => p.colores.some((c) => coloresSeleccionados.includes(c.nombre)));
        }
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
    }, [productos, tallasSeleccionadas, coloresSeleccionados, orden]);

    const categoriaNombre = categorias.find((c) => c.slug === categoriaActiva)?.nombre;
    const hayFiltrosExtra =
        tallasSeleccionadas.length > 0 || coloresSeleccionados.length > 0 || busqueda.length > 0;

    const limpiarFiltros = () => {
        setTallasSeleccionadas([]);
        setColoresSeleccionados([]);
        setInputBusqueda("");
        seleccionarCategoria("");
    };

    return (
        <main className="mx-auto max-w-7xl px-5 py-12 md:px-8">
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
                <button
                    onClick={() => seleccionarCategoria("")}
                    className={cn(
                        "rounded-lg border px-3 py-1.5 text-sm transition-colors",
                        !categoriaActiva
                            ? "border-fay-accent bg-fay-accent text-white"
                            : "border-fay-border text-fay-gray hover:border-fay-accent/50"
                    )}
                >
                    Todos
                </button>
                {categorias.map((c) => (
                    <button
                        key={c.slug}
                        onClick={() => seleccionarCategoria(c.slug)}
                        className={cn(
                            "rounded-lg border px-3 py-1.5 text-sm transition-colors",
                            categoriaActiva === c.slug
                                ? "border-fay-accent bg-fay-accent text-white"
                                : "border-fay-border text-fay-gray hover:border-fay-accent/50"
                        )}
                    >
                        {c.nombre}
                    </button>
                ))}
            </div>

            {(tallasDisponibles.length > 0 || coloresDisponibles.length > 0) && (
                <div className="mt-4 flex flex-wrap items-start gap-x-8 gap-y-3">
                    {tallasDisponibles.length > 0 && (
                        <div>
                            <p className="mb-1.5 text-xs text-fay-gray">Talla</p>
                            <div className="flex flex-wrap gap-1.5">
                                {tallasDisponibles.map((talla) => (
                                    <button
                                        key={talla}
                                        onClick={() => toggleTalla(talla)}
                                        className={cn(
                                            "rounded-md border px-2.5 py-1 text-xs transition-colors",
                                            tallasSeleccionadas.includes(talla)
                                                ? "border-fay-accent bg-fay-accent text-white"
                                                : "border-fay-border text-fay-gray hover:border-fay-accent/50"
                                        )}
                                    >
                                        {talla}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {coloresDisponibles.length > 0 && (
                        <div>
                            <p className="mb-1.5 text-xs text-fay-gray">Color</p>
                            <div className="flex flex-wrap gap-1.5">
                                {coloresDisponibles.map(([nombre, hex]) => (
                                    <button
                                        key={nombre}
                                        onClick={() => toggleColor(nombre)}
                                        aria-label={nombre}
                                        title={nombre}
                                        className={cn(
                                            "h-6 w-6 rounded-full border-2 transition-all",
                                            coloresSeleccionados.includes(nombre)
                                                ? "border-fay-accent scale-110"
                                                : "border-fay-border"
                                        )}
                                        style={{ backgroundColor: hex }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

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

                <select
                    value={orden}
                    onChange={(e) => setOrden(e.target.value as Orden)}
                    className="rounded-lg border border-fay-border bg-fay-surface px-3 py-1.5 text-sm text-white outline-none focus:border-fay-accent"
                >
                    <option value="">Más recientes</option>
                    <option value="precio-asc">Precio: menor a mayor</option>
                    <option value="precio-desc">Precio: mayor a menor</option>
                </select>
            </div>

            {error && <p className="mt-4 text-sm text-fay-accent-light">{error}</p>}

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
