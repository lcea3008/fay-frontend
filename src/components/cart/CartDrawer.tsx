import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { formatearPrecio } from "@/lib/utils";
import { abrirWhatsappConPedido } from "@/lib/whatsapp";

export default function CartDrawer() {
    const { items, abierto, cerrarCarrito, actualizarCantidad, quitarItem, total } =
        useCartStore();

    const manejarFinalizarCompra = () => {
        abrirWhatsappConPedido(items, total());
    };

    return (
        <AnimatePresence>
            {abierto && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={cerrarCarrito}
                        className="fixed inset-0 z-50 bg-black/60"
                    />
                    <motion.aside
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "tween", duration: 0.3 }}
                        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col border-l border-fay-border bg-fay-black"
                    >
                        <div className="flex items-center justify-between border-b border-fay-border px-5 py-4">
                            <h2 className="text-base font-medium">Tu carrito</h2>
                            <button aria-label="Cerrar carrito" onClick={cerrarCarrito} className="text-fay-gray hover:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-5 py-4">
                            {items.length === 0 ? (
                                <p className="mt-10 text-center text-sm text-fay-gray">
                                    Tu carrito está vacío. Explora la colección y encuentra tu próximo favorito.
                                </p>
                            ) : (
                                <ul className="space-y-5">
                                    {items.map((item) => (
                                        <li key={`${item.producto.id}-${item.talla}-${item.color}`} className="flex gap-3">
                                            <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-fay-surface">
                                                <img
                                                    src={item.producto.imagenes[0]}
                                                    alt={item.producto.nombre}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div className="flex flex-1 flex-col">
                                                <p className="text-sm">{item.producto.nombre}</p>
                                                <p className="text-xs text-fay-gray">
                                                    Talla {item.talla} · {item.color}
                                                </p>
                                                <div className="mt-auto flex items-center justify-between">
                                                    <div className="flex items-center gap-2 rounded-md border border-fay-border px-2 py-1">
                                                        <button
                                                            aria-label="Disminuir cantidad"
                                                            onClick={() =>
                                                                actualizarCantidad(item.producto.id, item.talla, item.color, item.cantidad - 1)
                                                            }
                                                            className="text-fay-gray hover:text-white"
                                                        >
                                                            <Minus size={12} />
                                                        </button>
                                                        <span className="text-xs">{item.cantidad}</span>
                                                        <button
                                                            aria-label="Aumentar cantidad"
                                                            onClick={() =>
                                                                actualizarCantidad(item.producto.id, item.talla, item.color, item.cantidad + 1)
                                                            }
                                                            className="text-fay-gray hover:text-white"
                                                        >
                                                            <Plus size={12} />
                                                        </button>
                                                    </div>
                                                    <button
                                                        aria-label="Quitar producto"
                                                        onClick={() => quitarItem(item.producto.id, item.talla, item.color)}
                                                        className="text-fay-gray hover:text-fay-accent"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                            <span className="text-sm font-medium">
                                                {formatearPrecio((item.producto.precioOferta ?? item.producto.precio) * item.cantidad)}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {items.length > 0 && (
                            <div className="border-t border-fay-border px-5 py-5">
                                <div className="mb-4 flex items-center justify-between text-sm">
                                    <span className="text-fay-gray">Subtotal</span>
                                    <span className="font-medium">{formatearPrecio(total())}</span>
                                </div>
                                <button
                                    onClick={manejarFinalizarCompra}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-fay-accent py-3 text-sm font-medium text-white transition-transform hover:scale-[1.01]"
                                >
                                    Finalizar compra por WhatsApp
                                </button>
                            </div>
                        )}
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}