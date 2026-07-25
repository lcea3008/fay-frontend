import { useState, type FormEvent, type ChangeEvent } from "react";
import { X, Upload, Link as LinkIcon, Plus, Trash2, Loader2 } from "lucide-react";
import type { Producto } from "@/types";
import { useCategorias } from "@/hooks/useCategorias";
import { useAuthStore } from "@/store/useAuthStore";
import { subirImagen } from "@/lib/uploads";
import { mostrarToast } from "@/store/useToastStore";

interface Props {
    productoInicial?: Producto;
    onGuardar: (producto: Producto) => void;
    onCerrar: () => void;
}

const TALLAS_SUGERIDAS = ["XS", "S", "M", "L", "XL", "XXL"];

const SUFIJO_SLUG = "new-fay";

function generarSlug(texto: string) {
    const base = texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    return base ? `${base}.${SUFIJO_SLUG}` : "";
}

export default function ProductoFormModal({ productoInicial, onGuardar, onCerrar }: Props) {
    const { categorias } = useCategorias();
    const token = useAuthStore((s) => s.token);
    const [slugEditadoManualmente, setSlugEditadoManualmente] = useState(!!productoInicial);
    const [subiendoImagen, setSubiendoImagen] = useState(false);

    const [form, setForm] = useState<Producto>(
        productoInicial ?? {
            id: `prod-${Date.now()}`,
            nombre: "",
            descripcion: "",
            precio: 0,
            categoria: "",
            tallas: [],
            colores: [],
            imagenes: [],
            stock: 0,
            slug: "",
        }
    );

    const [tallaCustom, setTallaCustom] = useState("");

    // --- Imágenes ---
    const agregarImagenPorLink = () => {
        setForm((f) => ({ ...f, imagenes: [...f.imagenes, ""] }));
    };

    const actualizarImagenLink = (index: number, valor: string) => {
        setForm((f) => ({
            ...f,
            imagenes: f.imagenes.map((img, i) => (i === index ? valor : img)),
        }));
    };

    const agregarImagenPorArchivo = async (e: ChangeEvent<HTMLInputElement>) => {
        const archivo = e.target.files?.[0];
        e.target.value = "";
        if (!archivo) return;
        if (!archivo.type.startsWith("image/")) {
            mostrarToast("Selecciona un archivo de imagen válido.", "error");
            return;
        }
        if (!token) return;

        setSubiendoImagen(true);
        try {
            const url = await subirImagen(archivo, token);
            setForm((f) => ({ ...f, imagenes: [...f.imagenes, url] }));
        } catch {
            mostrarToast("No se pudo subir la imagen. Intenta de nuevo.", "error");
        } finally {
            setSubiendoImagen(false);
        }
    };

    const eliminarImagen = (index: number) => {
        setForm((f) => ({ ...f, imagenes: f.imagenes.filter((_, i) => i !== index) }));
    };

    // --- Tallas ---
    const toggleTallaSugerida = (talla: string) => {
        setForm((f) =>
            f.tallas.includes(talla)
                ? { ...f, tallas: f.tallas.filter((t) => t !== talla) }
                : { ...f, tallas: [...f.tallas, talla] }
        );
    };

    const agregarTallaCustom = () => {
        const valor = tallaCustom.trim().toUpperCase();
        if (!valor || form.tallas.includes(valor)) return;
        setForm((f) => ({ ...f, tallas: [...f.tallas, valor] }));
        setTallaCustom("");
    };

    const quitarTalla = (talla: string) => {
        setForm((f) => ({ ...f, tallas: f.tallas.filter((t) => t !== talla) }));
    };

    // --- Colores ---
    const agregarColor = () => {
        setForm((f) => ({ ...f, colores: [...f.colores, { nombre: "", hex: "#0a0a0a" }] }));
    };

    const actualizarColor = (index: number, campo: "nombre" | "hex", valor: string) => {
        setForm((f) => ({
            ...f,
            colores: f.colores.map((c, i) => (i === index ? { ...c, [campo]: valor } : c)),
        }));
    };

    const eliminarColor = (index: number) => {
        setForm((f) => ({ ...f, colores: f.colores.filter((_, i) => i !== index) }));
    };

    const manejarSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (form.imagenes.length === 0 || form.imagenes.some((img) => !img)) {
            mostrarToast("Agrega al menos una imagen válida (sin campos vacíos).", "error");
            return;
        }
        if (form.tallas.length === 0) {
            mostrarToast("Selecciona al menos una talla.", "error");
            return;
        }
        if (form.colores.length === 0 || form.colores.some((c) => !c.nombre)) {
            mostrarToast("Agrega al menos un color con nombre.", "error");
            return;
        }
        if (!form.categoria) {
            mostrarToast("Selecciona una categoría.", "error");
            return;
        }

        onGuardar(form);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-5">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-fay-border bg-fay-surface p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-base font-medium">
                        {productoInicial ? "Editar producto" : "Nuevo producto"}
                    </h2>
                    <button onClick={onCerrar} className="text-fay-gray hover:text-white">
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={manejarSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-xs text-fay-gray">Nombre</label>
                        <input
                            required
                            value={form.nombre}
                            onChange={(e) => {
                                const nombre = e.target.value;
                                setForm((f) => ({
                                    ...f,
                                    nombre,
                                    slug: slugEditadoManualmente ? f.slug : generarSlug(nombre),
                                }));
                            }}
                            className="w-full rounded-lg border border-fay-border bg-fay-black px-3 py-2 text-sm outline-none focus:border-fay-accent"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-xs text-fay-gray">Slug (URL)</label>
                        <input
                            required
                            value={form.slug}
                            onChange={(e) => {
                                setSlugEditadoManualmente(true);
                                setForm({ ...form, slug: e.target.value });
                            }}
                            placeholder="legging-seamless-move"
                            className="w-full rounded-lg border border-fay-border bg-fay-black px-3 py-2 text-sm outline-none focus:border-fay-accent"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-xs text-fay-gray">Descripción</label>
                        <textarea
                            required
                            rows={2}
                            value={form.descripcion}
                            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                            className="w-full rounded-lg border border-fay-border bg-fay-black px-3 py-2 text-sm outline-none focus:border-fay-accent"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1 block text-xs text-fay-gray">Precio (S/)</label>
                            <input
                                required
                                type="number"
                                min={0}
                                value={form.precio}
                                onChange={(e) => setForm({ ...form, precio: Number(e.target.value) })}
                                className="w-full rounded-lg border border-fay-border bg-fay-black px-3 py-2 text-sm outline-none focus:border-fay-accent"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs text-fay-gray">Stock</label>
                            <input
                                required
                                type="number"
                                min={0}
                                value={form.stock}
                                onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                                className="w-full rounded-lg border border-fay-border bg-fay-black px-3 py-2 text-sm outline-none focus:border-fay-accent"
                            />
                        </div>
                    </div>

                    {/* Categoría, ahora desde la API */}
                    <div>
                        <label className="mb-1 block text-xs text-fay-gray">Categoría</label>
                        <select
                            required
                            value={form.categoria}
                            onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                            className="w-full rounded-lg border border-fay-border bg-fay-black px-3 py-2 text-sm outline-none focus:border-fay-accent"
                        >
                            <option value="">Selecciona una categoría</option>
                            {categorias.map((c) => (
                                <option key={c.slug} value={c.slug}>{c.nombre}</option>
                            ))}
                        </select>
                        {categorias.length === 0 && (
                            <p className="mt-1 text-xs text-fay-gray">
                                No hay categorías aún — créalas primero en la sección "Categorías" del menú.
                            </p>
                        )}
                    </div>

                    {/* Tallas */}
                    <div>
                        <label className="mb-1.5 block text-xs text-fay-gray">Tallas disponibles</label>
                        <div className="flex flex-wrap gap-2">
                            {TALLAS_SUGERIDAS.map((talla) => (
                                <button
                                    key={talla}
                                    type="button"
                                    onClick={() => toggleTallaSugerida(talla)}
                                    className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${form.tallas.includes(talla)
                                        ? "border-fay-accent bg-fay-accent text-white"
                                        : "border-fay-border text-fay-gray hover:border-fay-accent/50"
                                        }`}
                                >
                                    {talla}
                                </button>
                            ))}
                        </div>

                        <div className="mt-2 flex gap-2">
                            <input
                                value={tallaCustom}
                                onChange={(e) => setTallaCustom(e.target.value)}
                                placeholder="Otra talla (ej. 38)"
                                className="flex-1 rounded-lg border border-fay-border bg-fay-black px-3 py-1.5 text-xs outline-none focus:border-fay-accent"
                            />
                            <button
                                type="button"
                                onClick={agregarTallaCustom}
                                className="rounded-lg border border-fay-border px-3 py-1.5 text-xs text-fay-gray hover:text-white"
                            >
                                Agregar
                            </button>
                        </div>

                        {form.tallas.filter((t) => !TALLAS_SUGERIDAS.includes(t)).length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                                {form.tallas
                                    .filter((t) => !TALLAS_SUGERIDAS.includes(t))
                                    .map((talla) => (
                                        <span
                                            key={talla}
                                            className="flex items-center gap-1 rounded-lg border border-fay-accent bg-fay-accent px-3 py-1.5 text-xs text-white"
                                        >
                                            {talla}
                                            <button type="button" onClick={() => quitarTalla(talla)}>
                                                <X size={12} />
                                            </button>
                                        </span>
                                    ))}
                            </div>
                        )}
                    </div>

                    {/* Colores */}
                    <div>
                        <div className="mb-1.5 flex items-center justify-between">
                            <label className="text-xs text-fay-gray">Colores disponibles</label>
                            <button
                                type="button"
                                onClick={agregarColor}
                                className="flex items-center gap-1 text-xs text-fay-accent-light hover:text-white"
                            >
                                <Plus size={12} />
                                Agregar color
                            </button>
                        </div>

                        <div className="space-y-2">
                            {form.colores.map((color, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={color.hex}
                                        onChange={(e) => actualizarColor(i, "hex", e.target.value)}
                                        className="h-8 w-8 shrink-0 cursor-pointer rounded-md border border-fay-border bg-fay-black"
                                    />
                                    <input
                                        value={color.nombre}
                                        onChange={(e) => actualizarColor(i, "nombre", e.target.value)}
                                        placeholder="Nombre del color (ej. Negro)"
                                        className="flex-1 rounded-lg border border-fay-border bg-fay-black px-3 py-1.5 text-xs outline-none focus:border-fay-accent"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => eliminarColor(i)}
                                        className="shrink-0 text-fay-gray hover:text-fay-accent-light"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                            {form.colores.length === 0 && (
                                <p className="text-xs text-fay-gray">Aún no agregaste colores.</p>
                            )}
                        </div>
                    </div>

                    {/* Imágenes múltiples */}
                    <div>
                        <div className="mb-1.5 flex items-center justify-between">
                            <label className="text-xs text-fay-gray">Imágenes del producto</label>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={agregarImagenPorLink}
                                    className="flex items-center gap-1 text-xs text-fay-accent-light hover:text-white"
                                >
                                    <LinkIcon size={12} />
                                    Agregar link
                                </button>
                                <label className={`flex items-center gap-1 text-xs text-fay-accent-light hover:text-white ${subiendoImagen ? "pointer-events-none opacity-50" : "cursor-pointer"}`}>
                                    <Upload size={12} />
                                    Subir archivo
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={agregarImagenPorArchivo}
                                        disabled={subiendoImagen}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>

                        {subiendoImagen && (
                            <p className="mb-2 flex items-center gap-1.5 text-xs text-fay-gray">
                                <Loader2 size={12} className="animate-spin" />
                                Subiendo imagen...
                            </p>
                        )}

                        <div className="space-y-2">
                            {form.imagenes.map((img, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className="h-10 w-8 shrink-0 overflow-hidden rounded bg-fay-black">
                                        {img && <img src={img} alt="" className="h-full w-full object-cover" />}
                                    </div>
                                    <input
                                        value={img}
                                        onChange={(e) => actualizarImagenLink(i, e.target.value)}
                                        placeholder="https://..."
                                        className="flex-1 rounded-lg border border-fay-border bg-fay-black px-3 py-1.5 text-xs outline-none focus:border-fay-accent"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => eliminarImagen(i)}
                                        className="shrink-0 text-fay-gray hover:text-fay-accent-light"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                            {form.imagenes.length === 0 && (
                                <p className="text-xs text-fay-gray">Aún no agregaste imágenes.</p>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={subiendoImagen}
                        className="mt-2 w-full rounded-lg bg-fay-accent py-2.5 text-sm font-medium text-white transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Guardar producto
                    </button>
                </form>
            </div>
        </div>
    );
}