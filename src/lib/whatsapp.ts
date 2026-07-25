import type { ItemCarrito } from "@/types";
import { formatearPrecio } from "@/lib/utils";

// Se usa solo si en Configuración (admin) todavía no se cargó ningún número.
const NUMERO_WHATSAPP_FALLBACK = "51932836750";

export function construirMensajeWhatsapp(items: ItemCarrito[], total: number): string {
    const lineas = items.map((item) => {
        const precio = item.producto.precioOferta ?? item.producto.precio;
        return `• ${item.producto.nombre} (Talla ${item.talla}, ${item.color}) x${item.cantidad} — ${formatearPrecio(precio * item.cantidad)}`;
    });

    const mensaje = [
        "¡Hola FAY! Quiero hacer este pedido:",
        "",
        ...lineas,
        "",
        `Total: ${formatearPrecio(total)}`,
    ].join("\n");

    return mensaje;
}

export function abrirWhatsappConPedido(items: ItemCarrito[], total: number, numeroWhatsapp?: string | null) {
    const mensaje = construirMensajeWhatsapp(items, total);
    const url = `https://wa.me/${numeroWhatsapp || NUMERO_WHATSAPP_FALLBACK}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
}

export function abrirWhatsappConConsulta(
    nombre: string,
    email: string,
    mensaje: string,
    numeroWhatsapp?: string | null
) {
    const texto = [
        "¡Hola FAY! Tengo una consulta:",
        "",
        `Nombre: ${nombre}`,
        `Email: ${email}`,
        "",
        mensaje,
    ].join("\n");

    const url = `https://wa.me/${numeroWhatsapp || NUMERO_WHATSAPP_FALLBACK}?text=${encodeURIComponent(texto)}`;
    window.open(url, "_blank");
}
