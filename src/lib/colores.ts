interface ColorNombrado {
    nombre: string;
    hex: string;
}

// Diccionario de colores en español, pensado para un catálogo de ropa deportiva.
// Incluye nombres de moda además de los colores base (ej. "Azul marino", "Rosa pastel").
const COLORES_NOMBRADOS: ColorNombrado[] = [
    { nombre: "Negro", hex: "#0a0a0a" },
    { nombre: "Blanco", hex: "#ffffff" },
    { nombre: "Gris", hex: "#6b7280" },
    { nombre: "Gris claro", hex: "#d1d5db" },
    { nombre: "Gris oscuro", hex: "#374151" },
    { nombre: "Plateado", hex: "#c0c0c0" },
    { nombre: "Azul", hex: "#2563eb" },
    { nombre: "Azul marino", hex: "#1e3a5f" },
    { nombre: "Azul rey", hex: "#1d4ed8" },
    { nombre: "Celeste", hex: "#7dd3fc" },
    { nombre: "Turquesa", hex: "#14b8a6" },
    { nombre: "Verde agua", hex: "#5eead4" },
    { nombre: "Rojo", hex: "#dc2626" },
    { nombre: "Vino", hex: "#7f1d1d" },
    { nombre: "Granate", hex: "#800020" },
    { nombre: "Rosa", hex: "#ec4899" },
    { nombre: "Rosa pastel", hex: "#fbcfe8" },
    { nombre: "Fucsia", hex: "#d6249f" },
    { nombre: "Coral", hex: "#ff7f50" },
    { nombre: "Salmón", hex: "#fa8072" },
    { nombre: "Verde", hex: "#16a34a" },
    { nombre: "Verde militar", hex: "#4b5320" },
    { nombre: "Verde oliva", hex: "#808000" },
    { nombre: "Verde menta", hex: "#98ff98" },
    { nombre: "Verde limón", hex: "#a3e635" },
    { nombre: "Amarillo", hex: "#eab308" },
    { nombre: "Mostaza", hex: "#d4a017" },
    { nombre: "Naranja", hex: "#ea580c" },
    { nombre: "Durazno", hex: "#ffdab9" },
    { nombre: "Morado", hex: "#7c3aed" },
    { nombre: "Lila", hex: "#c4b5fd" },
    { nombre: "Violeta", hex: "#8b5cf6" },
    { nombre: "Lavanda", hex: "#e6e6fa" },
    { nombre: "Beige", hex: "#e8dcc8" },
    { nombre: "Crema", hex: "#fffdd0" },
    { nombre: "Marrón", hex: "#78350f" },
    { nombre: "Marrón claro", hex: "#a97142" },
    { nombre: "Chocolate", hex: "#3f2305" },
    { nombre: "Camel", hex: "#c19a6b" },
    { nombre: "Dorado", hex: "#d4af37" },
    { nombre: "Bronce", hex: "#cd7f32" },
    { nombre: "Khaki", hex: "#c3b091" },
    { nombre: "Terracota", hex: "#c65d3b" },
    { nombre: "Índigo", hex: "#4b0082" },
    { nombre: "Cian", hex: "#06b6d4" },
    { nombre: "Aqua", hex: "#00ffff" },
    { nombre: "Esmeralda", hex: "#10b981" },
    { nombre: "Jade", hex: "#00a86b" },
    { nombre: "Perla", hex: "#f0eade" },
    { nombre: "Marfil", hex: "#fffff0" },
    { nombre: "Humo", hex: "#848884" },
    { nombre: "Carbón", hex: "#36454f" },
    { nombre: "Borgoña", hex: "#800020" },
    { nombre: "Ciruela", hex: "#8e4585" },
    { nombre: "Magenta", hex: "#d6249f" },
    { nombre: "Melón", hex: "#fdbcb4" },
    { nombre: "Chicle", hex: "#ffc1cc" },
    { nombre: "Menta", hex: "#aaf0d1" },
    { nombre: "Verde oliva claro", hex: "#a5a562" },
    { nombre: "Ocre", hex: "#cc7722" },
    { nombre: "Nude", hex: "#e3bc9a" },
];

const MAPA_ACENTOS: Record<string, string> = {
    á: "a",
    é: "e",
    í: "i",
    ó: "o",
    ú: "u",
    ü: "u",
    ñ: "n",
};

function normalizar(texto: string): string {
    return texto
        .toLowerCase()
        .trim()
        .split("")
        .map((caracter) => MAPA_ACENTOS[caracter] ?? caracter)
        .join("");
}

/**
 * Busca el hex correspondiente a un nombre de color escrito por el usuario.
 * Prioriza coincidencia exacta; si no hay, busca el nombre del diccionario
 * más específico (más largo) contenido dentro del texto escrito.
 * Devuelve null si no encuentra ninguna coincidencia (no fuerza un color).
 */
export function buscarHexPorNombre(texto: string): string | null {
    const normalizado = normalizar(texto);
    if (!normalizado) return null;

    const exacto = COLORES_NOMBRADOS.find((c) => normalizar(c.nombre) === normalizado);
    if (exacto) return exacto.hex;

    const contenidos = COLORES_NOMBRADOS
        .filter((c) => normalizado.includes(normalizar(c.nombre)))
        .sort((a, b) => b.nombre.length - a.nombre.length);

    return contenidos[0]?.hex ?? null;
}

function hexARgb(hex: string): [number, number, number] {
    const limpio = hex.replace("#", "");
    const bigint = parseInt(limpio, 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

// Distancia "redmean": aproxima mejor la percepción humana del color
// que una distancia euclidiana simple en RGB, sin necesitar convertir a otro espacio de color.
function distanciaColor(hexA: string, hexB: string): number {
    const [r1, g1, b1] = hexARgb(hexA);
    const [r2, g2, b2] = hexARgb(hexB);
    const rMedio = (r1 + r2) / 2;
    const dr = r1 - r2;
    const dg = g1 - g2;
    const db = b1 - b2;
    return Math.sqrt((2 + rMedio / 256) * dr * dr + 4 * dg * dg + (2 + (255 - rMedio) / 256) * db * db);
}

/** Busca el nombre del color del diccionario más cercano a un hex arbitrario. */
export function buscarNombrePorHex(hex: string): string {
    let masCercano = COLORES_NOMBRADOS[0];
    let menorDistancia = Infinity;

    for (const color of COLORES_NOMBRADOS) {
        const distancia = distanciaColor(hex, color.hex);
        if (distancia < menorDistancia) {
            menorDistancia = distancia;
            masCercano = color;
        }
    }

    return masCercano.nombre;
}
