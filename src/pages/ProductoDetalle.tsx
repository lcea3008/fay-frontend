import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useProducto } from "@/hooks/useProducto";
import { useCartStore } from "@/store/useCartStore";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { formatearPrecio, cn } from "@/lib/utils";

export default function ProductoDetalle() {
    const { slug } = useParams<{ slug: string }>();
    const { producto, cargando } = useProducto(slug);
    const agregarItem = useCartStore((s) => s.agregarItem);

    const [imagenActiva, setImagenActiva] = useState(0);
    const [tallaSeleccionada, setTallaSeleccionada] = useState<string | null>(null);
    const [colorSeleccionado, setColorSeleccionado] = useState<string | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        setImagenActiva(0);
        setTallaSeleccionada(null);
        setColorSeleccionado(null);
        setError("");
    }, [producto?.id]);

    if (cargando) {
        return (
            <main className="mx-auto max-w-7xl px-5 py-12 md:px-8">
                <div className="grid animate-pulse gap-10 md:grid-cols-2">
                    <div className="aspect-[3/4] rounded-2xl bg-fay-surface" />
                    <div className="space-y-4">
                        <div className="h-7 w-2/3 rounded bg-fay-surface" />
                        <div className="h-5 w-1/4 rounded bg-fay-surface" />
                        <div className="h-16 w-full rounded bg-fay-surface" />
                        <div className="h-10 w-1/2 rounded bg-fay-surface" />
                    </div>
                </div>
            </main>
        );
    }

    if (!producto) {
        return (
            <main className="mx-auto max-w-7xl px-5 py-20 text-center md:px-8">
                <p className="text-fay-gray">Producto no encontrado.</p>
                <Link to="/productos" className="mt-4 inline-block text-sm text-fay-accent-light">
                    Volver a productos
                </Link>
            </main>
        );
    }

    const agotado = producto.stock === 0;
    const pocoStock = !agotado && producto.stock <= 5;

    const manejarAgregar = () => {
        if (agotado) return;
        if (!tallaSeleccionada || !colorSeleccionado) {
            setError("Selecciona talla y color antes de continuar.");
            return;
        }
        setError("");
        agregarItem(producto, tallaSeleccionada, colorSeleccionado);
    };

    return (
        <main className="mx-auto max-w-7xl px-5 py-12 md:px-8">
            <Breadcrumbs
                items={[
                    { label: "Inicio", to: "/" },
                    { label: "Productos", to: "/productos" },
                    { label: producto.nombre },
                ]}
            />

            <div className="mt-6 grid gap-10 md:grid-cols-2">
                <div>
                    <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-fay-surface">
                        <img
                            src={producto.imagenes[imagenActiva]}
                            alt={producto.nombre}
                            className={cn("h-full w-full object-cover", agotado && "opacity-60")}
                        />
                    </div>

                    {producto.imagenes.length > 1 && (
                        <div className="mt-3 flex gap-2">
                            {producto.imagenes.map((img, i) => (
                                <button
                                    key={img + i}
                                    onClick={() => setImagenActiva(i)}
                                    aria-label={`Ver imagen ${i + 1}`}
                                    className={cn(
                                        "h-16 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-colors",
                                        i === imagenActiva ? "border-fay-accent" : "border-transparent opacity-70 hover:opacity-100"
                                    )}
                                >
                                    <img src={img} alt="" className="h-full w-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    {agotado && (
                        <span className="mb-2 inline-block rounded-md bg-fay-surface-2 px-2 py-1 text-[10px] font-medium tracking-wide text-fay-gray">
                            AGOTADO
                        </span>
                    )}
                    <h1 className="text-2xl font-semibold md:text-3xl">{producto.nombre}</h1>
                    <div className="mt-2 flex items-center gap-2">
                        <span className="text-lg font-medium">
                            {formatearPrecio(producto.precioOferta ?? producto.precio)}
                        </span>
                        {producto.precioOferta && (
                            <span className="text-sm text-fay-gray line-through">
                                {formatearPrecio(producto.precio)}
                            </span>
                        )}
                    </div>
                    {pocoStock && (
                        <p className="mt-2 text-xs text-fay-accent-light">¡Solo quedan {producto.stock} unidades!</p>
                    )}
                    <p className="mt-4 text-sm leading-relaxed text-fay-gray">{producto.descripcion}</p>

                    <div className="mt-6">
                        <p className="mb-2 text-xs text-fay-gray">Talla</p>
                        <div className="flex flex-wrap gap-2">
                            {producto.tallas.map((talla) => (
                                <button
                                    key={talla}
                                    onClick={() => setTallaSeleccionada(talla)}
                                    className={cn(
                                        "rounded-lg border px-3 py-1.5 text-sm transition-colors",
                                        tallaSeleccionada === talla
                                            ? "border-fay-accent bg-fay-accent text-white"
                                            : "border-fay-border text-fay-gray hover:border-fay-accent/50"
                                    )}
                                >
                                    {talla}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6">
                        <p className="mb-2 text-xs text-fay-gray">Color</p>
                        <div className="flex flex-wrap gap-2">
                            {producto.colores.map((color) => (
                                <button
                                    key={color.nombre}
                                    onClick={() => setColorSeleccionado(color.nombre)}
                                    aria-label={color.nombre}
                                    className={cn(
                                        "h-8 w-8 rounded-full border-2 transition-all",
                                        colorSeleccionado === color.nombre ? "border-fay-accent scale-110" : "border-fay-border"
                                    )}
                                    style={{ backgroundColor: color.hex }}
                                />
                            ))}
                        </div>
                    </div>

                    {error && <p className="mt-4 text-xs text-fay-accent-light">{error}</p>}

                    <button
                        onClick={manejarAgregar}
                        disabled={agotado}
                        className={cn(
                            "mt-8 w-full rounded-lg py-3 text-sm font-medium transition-transform md:w-auto md:px-10",
                            agotado
                                ? "cursor-not-allowed bg-fay-surface-2 text-fay-gray"
                                : "bg-fay-accent text-white hover:scale-[1.01]"
                        )}
                    >
                        {agotado ? "Agotado" : "Agregar al carrito"}
                    </button>
                </div>
            </div>
        </main>
    );
}
