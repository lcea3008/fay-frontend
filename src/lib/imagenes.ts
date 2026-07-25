interface OpcionesImagen {
    ancho?: number;
    alto?: number;
}

/**
 * Inserta transformaciones de Cloudinary (formato/calidad automáticos + resize)
 * en una URL ya subida, para no bajar la imagen a resolución completa
 * cuando se muestra chica (ej. en una card de 300px).
 * Si la URL no es de Cloudinary (ej. Unsplash en datos de ejemplo), la devuelve tal cual.
 */
export function optimizarImagen(url: string | undefined | null, opciones: OpcionesImagen = {}): string {
    if (!url || !url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
        return url ?? "";
    }

    const { ancho, alto } = opciones;
    const partes = ["f_auto", "q_auto"];
    if (ancho) partes.push(`w_${ancho}`);
    if (alto) partes.push(`h_${alto}`);
    if (ancho && alto) partes.push("c_fill");

    return url.replace("/upload/", `/upload/${partes.join(",")}/`);
}
