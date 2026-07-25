import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
import { useCategorias } from "@/hooks/useCategorias";
import { useAuthStore } from "@/store/useAuthStore";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import CategoriaFormModal from "@/components/admin/CategoriaFormModal";
import { confirmarAccion } from "@/store/useConfirmStore";
import type { CategoriaProducto, Producto, Oferta } from "@/types";

export default function AdminCategorias() {
    const { categorias, cargando, recargar } = useCategorias();
    const token = useAuthStore((s) => s.token);
    const [error, setError] = useState("");
    const [guardando, setGuardando] = useState(false);

    const [modalAbierto, setModalAbierto] = useState(false);
    const [categoriaEditando, setCategoriaEditando] = useState<CategoriaProducto | undefined>();

    const abrirNueva = () => {
        setCategoriaEditando(undefined);
        setModalAbierto(true);
    };

    const abrirEditar = (categoria: CategoriaProducto) => {
        setCategoriaEditando(categoria);
        setModalAbierto(true);
    };

    const manejarGuardar = async (nombre: string) => {
        if (!token) return;
        setGuardando(true);
        setError("");
        try {
            if (categoriaEditando) {
                await api.put(`/categorias/${categoriaEditando.id}`, { nombre }, token);
            } else {
                await api.post("/categorias", { nombre }, token);
            }
            setModalAbierto(false);
            recargar();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Error al guardar la categoría");
        } finally {
            setGuardando(false);
        }
    };

    const manejarEliminar = async (categoria: CategoriaProducto) => {
        if (!token) return;

        try {
            const [productosEnUso, ofertas] = await Promise.all([
                api.get<Producto[]>(`/productos?categoria=${categoria.slug}`),
                api.get<Oferta[]>("/ofertas"),
            ]);
            const ofertasEnUso = ofertas.filter((o) => o.categoriaRelacionada === categoria.slug);
            const totalEnUso = productosEnUso.length + ofertasEnUso.length;

            const mensaje =
                totalEnUso > 0
                    ? `"${categoria.nombre}" está en uso por ${productosEnUso.length} producto(s) y ${ofertasEnUso.length} oferta(s). Si la eliminas, quedarán sin esta categoría asignada. ¿Eliminar de todas formas?`
                    : `¿Eliminar la categoría "${categoria.nombre}"? Esta acción no se puede deshacer.`;

            if (!(await confirmarAccion(mensaje))) return;

            await api.delete(`/categorias/${categoria.id}`, token);
            recargar();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Error al eliminar");
        }
    };

    return (
        <div>
            <Helmet>
                <title>Categorías · Panel admin</title>
            </Helmet>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Categorías</h1>
                    <p className="mt-1 text-sm text-fay-gray">
                        Administra las categorías disponibles para tus productos y ofertas.
                    </p>
                </div>
                <Button size="sm" onClick={abrirNueva} className="self-start sm:self-auto">
                    <Plus size={16} />
                    Nueva categoría
                </Button>
            </div>

            {error && <p className="mt-3 text-xs text-fay-danger-light">{error}</p>}

            {cargando ? (
                <p className="mt-6 text-sm text-fay-gray">Cargando...</p>
            ) : (
                <div className="mt-6 overflow-hidden rounded-xl border border-fay-border">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[480px] text-sm">
                            <thead>
                                <tr className="border-b border-fay-border bg-fay-surface text-left text-xs text-fay-gray">
                                    <th className="px-4 py-3 font-medium">Categoría</th>
                                    <th className="px-4 py-3 font-medium">Slug</th>
                                    <th className="px-4 py-3 font-medium text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categorias.map((c) => (
                                    <tr key={c.id} className="border-b border-fay-border last:border-0">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <Tag size={14} className="shrink-0 text-fay-gray" />
                                                {c.nombre}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-fay-gray">{c.slug}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-3">
                                                <button onClick={() => abrirEditar(c)} className="text-fay-gray hover:text-white">
                                                    <Pencil size={15} />
                                                </button>
                                                <button
                                                    onClick={() => manejarEliminar(c)}
                                                    className="text-fay-gray hover:text-fay-danger-light"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {modalAbierto && (
                <CategoriaFormModal
                    categoriaInicial={categoriaEditando}
                    guardando={guardando}
                    onGuardar={manejarGuardar}
                    onCerrar={() => setModalAbierto(false)}
                />
            )}
        </div>
    );
}
