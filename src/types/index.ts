// Modelos de datos de FAY.
// Estos tipos son el borrador del futuro esquema de base de datos:
// cada interfaz se corresponderá con una tabla/colección cuando se
// construya el backend con Express.

export interface ColorProducto {
    nombre: string;
    hex: string;
    imagen?: string | null;
}

export interface Producto {
    id: string;
    nombre: string;
    descripcion: string;
    precio: number;
    precioOferta?: number;
    categoria: string;
    tallas: string[];
    colores: ColorProducto[];
    imagenes: string[];
    stock: number;
    destacado?: boolean;
    nuevo?: boolean;
    slug: string;
    vecesAgregado?: number;
}

export interface CategoriaProducto {
    id: string;
    nombre: string;
    slug: string;
    imagen: string | null;
}

export interface ItemCarrito {
    producto: Producto;
    cantidad: number;
    talla: string;
    color: string;
}

export interface Oferta {
    id: string;
    titulo: string;
    descripcion: string;
    imagen: string;
    precio: number;
    fechaInicio: string;
    fechaFin: string;
    activaManual?: boolean;
    descuento: number;
    categoriaRelacionada?: string;
}

export interface Usuario {
    id: string;
    nombre: string;
    email: string;
    rol: "admin" | "editor";
}

export interface Configuracion {
    id: string;
    whatsapp: string | null;
    instagram: string | null;
    tiktok: string | null;
}