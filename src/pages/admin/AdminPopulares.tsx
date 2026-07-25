import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { TrendingUp } from "lucide-react";
import { api } from "@/lib/api";
import { formatearPrecio } from "@/lib/utils";
import { optimizarImagen } from "@/lib/imagenes";
import type { Producto } from "@/types";

export default function AdminPopulares() {
    const [ranking, setRanking] = useState<Producto[]>([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        api
            .get<Producto[]>("/productos/populares")
            .then(setRanking)
            .finally(() => setCargando(false));
    }, []);

    return (
        <div>
            <Helmet>
                <title>Populares · Panel admin</title>
            </Helmet>
            <h1 className="text-2xl font-semibold">Productos populares</h1>
            <p className="mt-1 text-sm text-fay-gray">
                Productos más agregados al carrito por los visitantes.
            </p>

            {cargando ? (
                <p className="mt-6 text-sm text-fay-gray">Cargando...</p>
            ) : ranking.length === 0 ? (
                <div className="mt-10 rounded-xl border border-fay-border bg-fay-surface p-8 text-center">
                    <TrendingUp size={24} className="mx-auto text-fay-gray" />
                    <p className="mt-3 text-sm text-fay-gray">
                        Todavía no hay suficientes datos. Aparecerán aquí en cuanto los visitantes empiecen a agregar productos al carrito.
                    </p>
                </div>
            ) : (
                <div className="mt-6 overflow-hidden rounded-xl border border-fay-border">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[520px] text-sm">
                            <thead>
                                <tr className="border-b border-fay-border bg-fay-surface text-left text-xs text-fay-gray">
                                    <th className="px-4 py-3 font-medium">#</th>
                                    <th className="px-4 py-3 font-medium">Producto</th>
                                    <th className="px-4 py-3 font-medium">Precio</th>
                                    <th className="px-4 py-3 font-medium">Veces agregado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ranking.map((producto, i) => (
                                    <tr key={producto.id} className="border-b border-fay-border last:border-0">
                                        <td className="px-4 py-3 text-fay-gray">{i + 1}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <img src={optimizarImagen(producto.imagenes[0], { ancho: 60 })} alt={producto.nombre} className="h-10 w-8 shrink-0 rounded object-cover" />
                                                {producto.nombre}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">{formatearPrecio(producto.precioOferta ?? producto.precio)}</td>
                                        <td className="px-4 py-3 font-medium text-fay-accent-light">
                                            {producto.vecesAgregado ?? 0}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}