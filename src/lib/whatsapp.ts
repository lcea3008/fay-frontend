import type { ItemCarrito } from "@/types";
import { formatearPrecio } from "@/lib/utils";

// Reemplaza por el número real de FAY, con código de país sin '+' ni espacios.
// Ejemplo Perú: 51987654321
const NUMERO_WHATSAPP = "51932836750";

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

export function abrirWhatsappConPedido(items: ItemCarrito[], total: number) {
    const mensaje = construirMensajeWhatsapp(items, total);
    const url = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
}

export function abrirWhatsappConConsulta(nombre: string, email: string, mensaje: string) {
    const texto = [
        "¡Hola FAY! Tengo una consulta:",
        "",
        `Nombre: ${nombre}`,
        `Email: ${email}`,
        "",
        mensaje,
    ].join("\n");

    const url = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(texto)}`;
    window.open(url, "_blank");
}