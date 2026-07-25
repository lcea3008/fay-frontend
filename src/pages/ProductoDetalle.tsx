import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useProducto } from "@/hooks/useProducto";
import { useCartStore } from "@/store/useCartStore";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Chip from "@/components/ui/Chip";
import Badge from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatearPrecio, cn } from "@/lib/utils";
import { optimizarImagen } from "@/lib/imagenes";

export default function ProductoDetalle() {
    const { slug } = useParams<{ slug: string }>();
    const { producto, cargando } = useProducto(slug);
    const agregarItem = useCartStore((s) => s.agregarItem);

    const [imagenActiva, setImagenActiva] = useState(0);
    const [imagenColorActivo, setImagenColorActivo] = useState<string | null>(null);
    const [tallaSeleccionada, setTallaSeleccionada] = useState<string | null>(null);
    const [colorSeleccionado, setColorSeleccionado] = useState<string | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        setImagenActiva(0);
        setImagenColorActivo(null);
        setTallaSeleccionada(null);
        setColorSeleccionado(null);
        setError("");
    }, [producto?.id]);

    const manejarSeleccionColor = (nombre: string, imagen?: string | null) => {
        setColorSeleccionado(nombre);
        setImagenColorActivo(imagen || null);
    };

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
                <Helmet>
                    <title>Producto no encontrado · FAY</title>
                    <meta name="robots" content="noindex" />
                </Helmet>
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

    const descripcionMeta =
        producto.descripcion.length > 155 ? `${producto.descripcion.slice(0, 155)}…` : producto.descripcion;

    const jsonLd = {
        "@context": "https://schema.org/",
        "@type": "Product",
        name: producto.nombre,
        description: producto.descripcion,
        image: producto.imagenes,
        offers: {
            "@type": "Offer",
            priceCurrency: "PEN",
            price: producto.precioOferta ?? producto.precio,
            availability: agotado ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
        },
    };

    return (
        <main className="mx-auto max-w-7xl px-5 py-12 md:px-8">
            <Helmet>
                <title>{producto.nombre} · FAY</title>
                <meta name="description" content={descripcionMeta} />
                <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
            </Helmet>
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
                            src={optimizarImagen(imagenColorActivo ?? producto.imagenes[imagenActiva], { ancho: 800 })}
                            alt={producto.nombre}
                            className={cn("h-full w-full object-cover", agotado && "opacity-60")}
                        />
                    </div>

                    {producto.imagenes.length > 1 && (
                        <div className="mt-3 flex gap-2">
                            {producto.imagenes.map((img, i) => (
                                <button
                                    key={img + i}
                                    onClick={() => {
                                        setImagenColorActivo(null);
                                        setImagenActiva(i);
                                    }}
                                    aria-label={`Ver imagen ${i + 1}`}
                                    className={cn(
                                        "h-16 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-colors",
                                        !imagenColorActivo && i === imagenActiva
                                            ? "border-fay-accent"
                                            : "border-transparent opacity-70 hover:opacity-100"
                                    )}
                                >
                                    <img
                                        src={optimizarImagen(img, { ancho: 100, alto: 100 })}
                                        alt=""
                                        loading="lazy"
                                        className="h-full w-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    {agotado && (
                        <Badge variant="muted" className="mb-2 inline-block">
                            AGOTADO
                        </Badge>
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
                        <p className="mt-2 text-xs text-fay-danger-light">¡Solo quedan {producto.stock} unidades!</p>
                    )}
                    <p className="mt-4 text-sm leading-relaxed text-fay-gray">{producto.descripcion}</p>

                    <div className="mt-6">
                        <p className="mb-2 text-xs text-fay-gray">Talla</p>
                        <div className="flex flex-wrap gap-2">
                            {producto.tallas.map((talla) => (
                                <Chip
                                    key={talla}
                                    active={tallaSeleccionada === talla}
                                    onClick={() => setTallaSeleccionada(talla)}
                                >
                                    {talla}
                                </Chip>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6">
                        <p className="mb-2 text-xs text-fay-gray">Color</p>
                        <div className="flex flex-wrap gap-2">
                            {producto.colores.map((color) => (
                                <button
                                    key={color.nombre}
                                    onClick={() => manejarSeleccionColor(color.nombre, color.imagen)}
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

                    {error && <p className="mt-4 text-xs text-fay-danger-light">{error}</p>}

                    <Button
                        onClick={manejarAgregar}
                        disabled={agotado}
                        size="lg"
                        fullWidth
                        className={cn("mt-8 md:w-auto md:px-10", agotado && "bg-fay-surface-2 text-fay-gray")}
                    >
                        {agotado ? "Agotado" : "Agregar al carrito"}
                    </Button>
                </div>
            </div>
        </main>
    );
}
