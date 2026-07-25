import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import type { CategoriaProducto } from "@/types";

interface Props {
    categoriaInicial?: CategoriaProducto;
    onGuardar: (nombre: string) => void;
    onCerrar: () => void;
    guardando?: boolean;
}

export default function CategoriaFormModal({ categoriaInicial, onGuardar, onCerrar, guardando }: Props) {
    const [nombre, setNombre] = useState(categoriaInicial?.nombre ?? "");

    const manejarSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!nombre.trim()) return;
        onGuardar(nombre.trim());
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-5">
            <div className="w-full max-w-sm rounded-xl border border-fay-border bg-fay-surface p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-base font-medium">
                        {categoriaInicial ? "Editar categoría" : "Nueva categoría"}
                    </h2>
                    <button onClick={onCerrar} className="text-fay-gray hover:text-white">
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={manejarSubmit} className="space-y-3">
                    <div>
                        <label className="mb-1 block text-xs text-fay-gray">Nombre</label>
                        <input
                            required
                            autoFocus
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="ej. Accesorios"
                            className="w-full rounded-lg border border-fay-border bg-fay-black px-3 py-2 text-sm outline-none focus:border-fay-accent"
                        />
                    </div>

                    {categoriaInicial && (
                        <p className="text-xs text-fay-gray">
                            Slug: {categoriaInicial.slug} (no cambia al editar el nombre)
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={guardando}
                        className="mt-2 w-full rounded-lg bg-fay-accent py-2.5 text-sm font-medium text-white transition-transform hover:scale-[1.01] disabled:opacity-60"
                    >
                        {guardando ? "Guardando..." : "Guardar"}
                    </button>
                </form>
            </div>
        </div>
    );
}
