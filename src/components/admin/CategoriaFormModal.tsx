import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import type { CategoriaProducto } from "@/types";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

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
                    <Input
                        label="Nombre"
                        required
                        autoFocus
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="ej. Accesorios"
                        className="bg-fay-black"
                    />

                    {categoriaInicial && (
                        <p className="text-xs text-fay-gray">
                            Slug: {categoriaInicial.slug} (no cambia al editar el nombre)
                        </p>
                    )}

                    <Button type="submit" loading={guardando} fullWidth className="mt-2">
                        {guardando ? "Guardando..." : "Guardar"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
