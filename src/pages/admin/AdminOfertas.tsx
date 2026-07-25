import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useOfertasAdminStore } from "@/store/useOfertasAdminStore";
import { useAuthStore } from "@/store/useAuthStore";
import { formatearPrecio, ofertaEstaActiva } from "@/lib/utils";
import { optimizarImagen } from "@/lib/imagenes";
import { Button } from "@/components/ui/Button";
import OfertaFormModal from "@/components/admin/OfertaFormModal";
import { confirmarAccion } from "@/store/useConfirmStore";
import type { Oferta } from "@/types";

function estadoOferta(oferta: Oferta): { texto: string; clase: string } {
    const activa = ofertaEstaActiva(oferta.fechaInicio, oferta.fechaFin, oferta.activaManual);
    const ahora = new Date();
    const inicio = new Date(oferta.fechaInicio);

    if (!activa && ahora < inicio) return { texto: "Próxima", clase: "text-fay-gray" };
    if (!activa) return { texto: "Expirada", clase: "text-fay-gray" };
    return { texto: "Activa", clase: "text-emerald-400" };
}

export default function AdminOfertas() {
    const { ofertas, cargando, error, cargarOfertas, crearOferta, actualizarOferta, eliminarOferta } =
        useOfertasAdminStore();
    const token = useAuthStore((s) => s.token);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [ofertaEditando, setOfertaEditando] = useState<Oferta | undefined>();

    useEffect(() => {
        cargarOfertas();
    }, [cargarOfertas]);

    const abrirNueva = () => {
        setOfertaEditando(undefined);
        setModalAbierto(true);
    };

    const abrirEditar = (oferta: Oferta) => {
        setOfertaEditando(oferta);
        setModalAbierto(true);
    };

    const manejarGuardar = async (oferta: Oferta) => {
        if (!token) return;
        if (ofertaEditando) {
            await actualizarOferta(oferta.id, oferta, token);
        } else {
            const { id, ...datos } = oferta;
            await crearOferta(datos, token);
        }
        setModalAbierto(false);
    };

    const manejarEliminar = async (oferta: Oferta) => {
        if (!token) return;
        const confirmado = await confirmarAccion(`¿Eliminar la oferta "${oferta.titulo}"? Esta acción no se puede deshacer.`);
        if (!confirmado) return;
        await eliminarOferta(oferta.id, token);
    };

    return (
        <div>
            <Helmet>
                <title>Ofertas · Panel admin</title>
            </Helmet>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Ofertas</h1>
                    <p className="mt-1 text-sm text-fay-gray">
                        {cargando ? "Cargando..." : "Gestiona las ofertas temporales que se muestran en el Home."}
                    </p>
                </div>
                <Button size="sm" onClick={abrirNueva} className="self-start sm:self-auto">
                    <Plus size={16} />
                    Nueva oferta
                </Button>
            </div>

            {error && <p className="mt-3 text-xs text-fay-danger-light">{error}</p>}

            <div className="mt-6 overflow-hidden rounded-xl border border-fay-border">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px] text-sm">
                        <thead>
                            <tr className="border-b border-fay-border bg-fay-surface text-left text-xs text-fay-gray">
                                <th className="px-4 py-3 font-medium">Oferta</th>
                                <th className="px-4 py-3 font-medium">Precio</th>
                                <th className="px-4 py-3 font-medium">Vigencia</th>
                                <th className="px-4 py-3 font-medium">Estado</th>
                                <th className="px-4 py-3 font-medium text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ofertas.map((oferta) => {
                                const estado = estadoOferta(oferta);
                                return (
                                    <tr key={oferta.id} className="border-b border-fay-border last:border-0">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <img src={optimizarImagen(oferta.imagen, { ancho: 80 })} alt="" className="h-10 w-14 shrink-0 rounded object-cover" />
                                                {oferta.titulo}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">{formatearPrecio(oferta.precio)}</td>
                                        <td className="px-4 py-3 text-fay-gray">
                                            {new Date(oferta.fechaInicio).toLocaleDateString("es-PE")} –{" "}
                                            {new Date(oferta.fechaFin).toLocaleDateString("es-PE")}
                                        </td>
                                        <td className={`px-4 py-3 ${estado.clase}`}>{estado.texto}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-3">
                                                <button onClick={() => abrirEditar(oferta)} className="text-fay-gray hover:text-white">
                                                    <Pencil size={15} />
                                                </button>
                                                <button
                                                    onClick={() => manejarEliminar(oferta)}
                                                    className="text-fay-gray hover:text-fay-danger-light"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {modalAbierto && (
                <OfertaFormModal
                    ofertaInicial={ofertaEditando}
                    onGuardar={manejarGuardar}
                    onCerrar={() => setModalAbierto(false)}
                />
            )}
        </div>
    );
}