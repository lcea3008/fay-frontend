import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import { X, Upload, Link as LinkIcon, Loader2 } from "lucide-react";
import type { Oferta } from "@/types";
import { useCategorias } from "@/hooks/useCategorias";
import { useAuthStore } from "@/store/useAuthStore";
import { subirImagen } from "@/lib/uploads";
import { mostrarToast } from "@/store/useToastStore";
import { formatearPrecio } from "@/lib/utils";
import { optimizarImagen } from "@/lib/imagenes";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface Props {
    ofertaInicial?: Oferta;
    onGuardar: (oferta: Oferta) => void;
    onCerrar: () => void;
}

const hoyISO = () => new Date().toISOString().slice(0, 10);
const enDiasISO = (dias: number) => {
    const d = new Date();
    d.setDate(d.getDate() + dias);
    return d.toISOString().slice(0, 10);
};

export default function OfertaFormModal({ ofertaInicial, onGuardar, onCerrar }: Props) {
    const { categorias } = useCategorias();
    const token = useAuthStore((s) => s.token);
    const [subiendoImagen, setSubiendoImagen] = useState(false);

    const [form, setForm] = useState<Oferta>(
        ofertaInicial ?? {
            id: `oferta-${Date.now()}`,
            titulo: "",
            descripcion: "",
            imagen: "",
            precio: 0,
            fechaInicio: hoyISO(),
            fechaFin: enDiasISO(7),
            descuento: 0,
            categoriaRelacionada: "",
        }
    );

    useEffect(() => {
        if (!ofertaInicial && !form.categoriaRelacionada && categorias.length > 0) {
            setForm((f) => ({ ...f, categoriaRelacionada: categorias[0].slug }));
        }
    }, [categorias, ofertaInicial, form.categoriaRelacionada]);

    const [modoImagen, setModoImagen] = useState<"link" | "archivo">(
        ofertaInicial?.imagen?.startsWith("data:") ? "archivo" : "link"
    );

    const manejarArchivo = async (e: ChangeEvent<HTMLInputElement>) => {
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
            setForm((f) => ({ ...f, imagen: url }));
        } catch {
            mostrarToast("No se pudo subir la imagen. Intenta de nuevo.", "error");
        } finally {
            setSubiendoImagen(false);
        }
    };

    const fechaInicioVal = form.fechaInicio.slice(0, 10);
    const fechaFinVal = form.fechaFin.slice(0, 10);
    const precioConDescuento = form.precio * (1 - form.descuento / 100);

    const manejarSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!form.imagen) {
            mostrarToast("Agrega una imagen (link o archivo) antes de guardar.", "error");
            return;
        }
        onGuardar(form);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-5">
            <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl border border-fay-border bg-fay-surface p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-base font-medium">
                        {ofertaInicial ? "Editar oferta" : "Nueva oferta"}
                    </h2>
                    <button onClick={onCerrar} className="text-fay-gray hover:text-white">
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={manejarSubmit} className="space-y-3">
                    <Input
                        label="Título"
                        required
                        value={form.titulo}
                        onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                        placeholder="-20% en leggings seamless"
                        className="bg-fay-black"
                    />

                    <Textarea
                        label="Descripción"
                        required
                        rows={2}
                        value={form.descripcion}
                        onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                        className="bg-fay-black"
                    />

                    <div className="grid grid-cols-2 gap-3">
                        <Input
                            label="Precio (S/)"
                            required
                            type="number"
                            min={0}
                            step="0.01"
                            value={form.precio}
                            onChange={(e) => setForm({ ...form, precio: Number(e.target.value) })}
                            className="bg-fay-black"
                        />
                        <Input
                            label="Descuento (%)"
                            type="number"
                            min={0}
                            max={100}
                            value={form.descuento}
                            onChange={(e) => setForm({ ...form, descuento: Number(e.target.value) })}
                            className="bg-fay-black"
                        />
                    </div>

                    {form.precio > 0 && form.descuento > 0 && (
                        <p className="text-xs text-fay-accent-light">
                            Precio con descuento: {formatearPrecio(precioConDescuento)}{" "}
                            <span className="text-fay-gray line-through">{formatearPrecio(form.precio)}</span>
                        </p>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        <Input
                            label="Fecha inicio"
                            required
                            type="date"
                            min={hoyISO()}
                            value={fechaInicioVal}
                            onChange={(e) => {
                                const nuevaInicio = e.target.value;
                                setForm((f) => ({
                                    ...f,
                                    fechaInicio: new Date(nuevaInicio).toISOString(),
                                    // si la fecha fin quedó antes de la nueva fecha inicio, la ajustamos
                                    fechaFin:
                                        new Date(f.fechaFin) < new Date(nuevaInicio)
                                            ? new Date(nuevaInicio).toISOString()
                                            : f.fechaFin,
                                }));
                            }}
                            className="bg-fay-black [color-scheme:dark]"
                        />
                        <Input
                            label="Fecha fin"
                            required
                            type="date"
                            min={fechaInicioVal}
                            value={fechaFinVal}
                            onChange={(e) => setForm({ ...form, fechaFin: new Date(e.target.value).toISOString() })}
                            className="bg-fay-black [color-scheme:dark]"
                        />
                    </div>

                    <Select
                        label="Categoría relacionada"
                        value={form.categoriaRelacionada}
                        onChange={(e) => setForm({ ...form, categoriaRelacionada: e.target.value })}
                        className="bg-fay-black"
                    >
                        {categorias.map((c) => (
                            <option key={c.slug} value={c.slug}>{c.nombre}</option>
                        ))}
                    </Select>

                    {/* Selector de imagen: link o archivo (igual que en Productos) */}
                    <div>
                        <label className="mb-1.5 block text-xs text-fay-gray">Imagen de la oferta</label>

                        <div className="mb-2 flex gap-1 rounded-lg border border-fay-border p-1">
                            <button
                                type="button"
                                onClick={() => setModoImagen("link")}
                                className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-xs transition-colors ${modoImagen === "link" ? "bg-fay-accent text-white" : "text-fay-gray hover:text-white"
                                    }`}
                            >
                                <LinkIcon size={13} />
                                Link
                            </button>
                            <button
                                type="button"
                                onClick={() => setModoImagen("archivo")}
                                className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-xs transition-colors ${modoImagen === "archivo" ? "bg-fay-accent text-white" : "text-fay-gray hover:text-white"
                                    }`}
                            >
                                <Upload size={13} />
                                Subir archivo
                            </button>
                        </div>

                        {modoImagen === "link" ? (
                            <input
                                value={form.imagen.startsWith("data:") ? "" : form.imagen}
                                onChange={(e) => setForm({ ...form, imagen: e.target.value })}
                                placeholder="https://..."
                                className="w-full rounded-lg border border-fay-border bg-fay-black px-3 py-2 text-sm outline-none focus:border-fay-accent"
                            />
                        ) : (
                            <input
                                type="file"
                                accept="image/*"
                                onChange={manejarArchivo}
                                disabled={subiendoImagen}
                                className="w-full rounded-lg border border-fay-border bg-fay-black px-3 py-2 text-xs text-fay-gray outline-none file:mr-3 file:rounded-md file:border-0 file:bg-fay-accent file:px-3 file:py-1.5 file:text-xs file:text-white disabled:opacity-50"
                            />
                        )}

                        {subiendoImagen && (
                            <p className="mt-2 flex items-center gap-1.5 text-xs text-fay-gray">
                                <Loader2 size={12} className="animate-spin" />
                                Subiendo imagen...
                            </p>
                        )}

                        {form.imagen && (
                            <div className="mt-2 h-16 w-24 overflow-hidden rounded-lg bg-fay-black">
                                <img src={optimizarImagen(form.imagen, { ancho: 150 })} alt="Vista previa" className="h-full w-full object-cover" />
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-fay-border px-3 py-2">
                        <span className="text-xs text-fay-gray">Forzar estado manualmente</span>
                        <select
                            value={form.activaManual === undefined ? "auto" : form.activaManual ? "activa" : "inactiva"}
                            onChange={(e) => {
                                const v = e.target.value;
                                setForm({ ...form, activaManual: v === "auto" ? undefined : v === "activa" });
                            }}
                            className="rounded-md border border-fay-border bg-fay-black px-2 py-1 text-xs outline-none"
                        >
                            <option value="auto">Automático (según fechas)</option>
                            <option value="activa">Forzar activa</option>
                            <option value="inactiva">Forzar inactiva</option>
                        </select>
                    </div>

                    <Button type="submit" disabled={subiendoImagen} fullWidth className="mt-2">
                        Guardar oferta
                    </Button>
                </form>
            </div>
        </div>
    );
}