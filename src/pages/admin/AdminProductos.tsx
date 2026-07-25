import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useProductosAdminStore } from "@/store/useProductosAdminStore";
import { useAuthStore } from "@/store/useAuthStore";
import { formatearPrecio } from "@/lib/utils";
import ProductoFormModal from "@/components/admin/ProductoFormModal";
import { confirmarAccion } from "@/store/useConfirmStore";
import type { Producto } from "@/types";

export default function AdminProductos() {
    const { productos, cargando, error, cargarProductos, crearProducto, actualizarProducto, eliminarProducto } =
        useProductosAdminStore();
    const token = useAuthStore((s) => s.token);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [productoEditando, setProductoEditando] = useState<Producto | undefined>();

    useEffect(() => {
        cargarProductos();
    }, [cargarProductos]);

    const abrirNuevo = () => {
        setProductoEditando(undefined);
        setModalAbierto(true);
    };

    const abrirEditar = (producto: Producto) => {
        setProductoEditando(producto);
        setModalAbierto(true);
    };

    const manejarGuardar = async (producto: Producto) => {
        if (!token) return;
        if (productoEditando) {
            await actualizarProducto(producto.id, producto, token);
        } else {
            const { id, ...datos } = producto;
            await crearProducto(datos, token);
        }
        setModalAbierto(false);
    };

    const manejarEliminar = async (producto: Producto) => {
        if (!token) return;
        const confirmado = await confirmarAccion(`¿Eliminar "${producto.nombre}"? Esta acción no se puede deshacer.`);
        if (!confirmado) return;
        await eliminarProducto(producto.id, token);
    };

    return (
        <div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Productos</h1>
                    <p className="mt-1 text-sm text-fay-gray">
                        {cargando ? "Cargando..." : `${productos.length} productos en catálogo`}
                    </p>
                </div>
                <button
                    onClick={abrirNuevo}
                    className="flex items-center gap-2 self-start rounded-lg bg-fay-accent px-4 py-2 text-sm font-medium text-white transition-transform hover:scale-[1.02] sm:self-auto"
                >
                    <Plus size={16} />
                    Nuevo producto
                </button>
            </div>

            {error && <p className="mt-3 text-xs text-fay-accent-light">{error}</p>}

            <div className="mt-6 overflow-hidden rounded-xl border border-fay-border">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px] text-sm">
                        <thead>
                            <tr className="border-b border-fay-border bg-fay-surface text-left text-xs text-fay-gray">
                                <th className="px-4 py-3 font-medium">Producto</th>
                                <th className="px-4 py-3 font-medium">Categoría</th>
                                <th className="px-4 py-3 font-medium">Precio</th>
                                <th className="px-4 py-3 font-medium">Stock</th>
                                <th className="px-4 py-3 font-medium text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productos.map((producto) => (
                                <tr key={producto.id} className="border-b border-fay-border last:border-0">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <img src={producto.imagenes[0]} alt={producto.nombre} className="h-10 w-8 shrink-0 rounded object-cover" />
                                            {producto.nombre}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-fay-gray">{producto.categoria}</td>
                                    <td className="px-4 py-3">{formatearPrecio(producto.precioOferta ?? producto.precio)}</td>
                                    <td className="px-4 py-3">
                                        <span className={producto.stock === 0 ? "text-fay-accent-light" : ""}>{producto.stock}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-3">
                                            <button onClick={() => abrirEditar(producto)} className="text-fay-gray hover:text-white">
                                                <Pencil size={15} />
                                            </button>
                                            <button
                                                onClick={() => manejarEliminar(producto)}
                                                className="text-fay-gray hover:text-fay-accent-light"
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

            {modalAbierto && (
                <ProductoFormModal
                    productoInicial={productoEditando}
                    onGuardar={manejarGuardar}
                    onCerrar={() => setModalAbierto(false)}
                />
            )}
        </div>
    );
}