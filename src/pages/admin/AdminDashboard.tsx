import { useEffect, useState } from "react";
import { useProductosAdminStore } from "@/store/useProductosAdminStore";
import { useOfertasAdminStore } from "@/store/useOfertasAdminStore";
import { ofertaEstaActiva } from "@/lib/utils";
import { api } from "@/lib/api";
import type { Producto } from "@/types";

export default function AdminDashboard() {
    const { productos, cargarProductos } = useProductosAdminStore();
    const { ofertas, cargarOfertas } = useOfertasAdminStore();
    const [productoTop, setProductoTop] = useState<Producto | null>(null);

    useEffect(() => {
        cargarProductos();
        cargarOfertas();
        api.get<Producto[]>("/productos/populares").then((populares) => {
            setProductoTop(populares[0] ?? null);
        });
    }, [cargarProductos, cargarOfertas]);

    const totalProductos = productos.length;
    const ofertasActivas = ofertas.filter((o) =>
        ofertaEstaActiva(o.fechaInicio, o.fechaFin, o.activaManual)
    ).length;
    const sinStock = productos.filter((p) => p.stock === 0).length;

    const metricas = [
        { label: "Productos", valor: totalProductos },
        { label: "Ofertas activas", valor: ofertasActivas },
        { label: "Sin stock", valor: sinStock },
        { label: "Producto top", valor: productoTop?.nombre ?? "—" },
    ];

    return (
        <div>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p className="mt-1 text-sm text-fay-gray">Resumen general de la tienda.</p>

            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                {metricas.map((m) => (
                    <div key={m.label} className="rounded-xl border border-fay-border bg-fay-surface p-4">
                        <p className="text-xs text-fay-gray">{m.label}</p>
                        <p
                            title={String(m.valor)}
                            className={`mt-1 truncate font-semibold ${typeof m.valor === "number" ? "text-2xl" : "text-lg"}`}
                        >
                            {m.valor}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}