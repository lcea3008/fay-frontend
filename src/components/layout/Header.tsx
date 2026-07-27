import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Search, ShoppingBag, Menu, X } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { cn } from "@/lib/utils";
import logoFay from "@/assets/logo-fay.png";

const NAV_LINKS = [
    { href: "/", label: "Home" },
    { href: "/productos", label: "Productos" },
    { href: "/ofertas", label: "Ofertas" },
    { href: "/nosotros", label: "Nosotros" },
    { href: "/contactanos", label: "Contáctanos" },
];

export default function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const enProductos = location.pathname === "/productos";
    const busquedaUrl = enProductos ? searchParams.get("buscar") ?? "" : "";

    const esActivo = (href: string) =>
        href === "/" ? location.pathname === "/" : location.pathname.startsWith(href);

    const [menuAbierto, setMenuAbierto] = useState(false);
    const [busquedaAbierta, setBusquedaAbierta] = useState(false);
    const [query, setQuery] = useState(busquedaUrl);
    const inputBusquedaRef = useRef<HTMLInputElement>(null);
    const cantidadTotal = useCartStore((s) => s.cantidadTotal());
    const abrirCarrito = useCartStore((s) => s.abrirCarrito);

    useEffect(() => {
        if (busquedaAbierta) inputBusquedaRef.current?.focus();
    }, [busquedaAbierta]);

    useEffect(() => {
        setQuery(busquedaUrl);
    }, [busquedaUrl]);

    useEffect(() => {
        if (query === busquedaUrl) return;
        const timeout = setTimeout(() => {
            const q = query.trim();
            if (enProductos) {
                const params = new URLSearchParams(searchParams);
                if (q) params.set("buscar", q);
                else params.delete("buscar");
                setSearchParams(params, { replace: true });
            } else if (q) {
                navigate(`/productos?buscar=${encodeURIComponent(q)}`);
            }
        }, 350);
        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query]);

    const manejarBusqueda = (e: FormEvent) => {
        e.preventDefault();
        const q = query.trim();
        if (!q) return;
        if (enProductos) {
            const params = new URLSearchParams(searchParams);
            params.set("buscar", q);
            setSearchParams(params, { replace: true });
        } else {
            navigate(`/productos?buscar=${encodeURIComponent(q)}`);
        }
        setBusquedaAbierta(false);
    };

    return (
        <header className="sticky top-0 z-40 border-b border-white/10 bg-black/90 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-5 md:px-8">
                <Link to="/" className="flex shrink-0 items-center gap-2.5">
                    <img src={logoFay} alt="FAY" className="h-9 w-9 object-contain" />
                    <span className="text-lg font-semibold tracking-wide">FAY</span>
                </Link>

                <nav className="hidden shrink-0 items-center gap-8 md:flex">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            to={link.href}
                            className={cn(
                                "text-sm transition-colors hover:text-white",
                                esActivo(link.href) ? "text-white" : "text-neutral-400"
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <form
                    onSubmit={manejarBusqueda}
                    className="hidden flex-1 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 md:flex md:max-w-xs lg:max-w-sm"
                >
                    <Search size={15} className="shrink-0 text-neutral-500" />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Buscar productos..."
                        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-neutral-500"
                    />
                </form>

                <div className="ml-auto flex shrink-0 items-center gap-4">
                    <ThemeToggle />
                    <button
                        aria-label={busquedaAbierta ? "Cerrar búsqueda" : "Buscar"}
                        onClick={() => setBusquedaAbierta((v) => !v)}
                        className="text-neutral-400 transition-colors hover:text-white md:hidden"
                    >
                        {busquedaAbierta ? <X size={19} /> : <Search size={19} />}
                    </button>
                    <button
                        aria-label="Abrir carrito"
                        onClick={abrirCarrito}
                        className="relative text-neutral-400 transition-colors hover:text-white"
                    >
                        <ShoppingBag size={19} />
                        {cantidadTotal > 0 && (
                            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-fay-accent text-[10px] font-medium text-white">
                                {cantidadTotal}
                            </span>
                        )}
                    </button>
                    <button
                        aria-label="Abrir menú"
                        className="text-neutral-400 transition-colors hover:text-white md:hidden"
                        onClick={() => setMenuAbierto((v) => !v)}
                    >
                        {menuAbierto ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            <div
                className={cn(
                    "overflow-hidden border-t border-white/10 transition-[max-height] duration-300 md:hidden",
                    busquedaAbierta ? "max-h-20" : "max-h-0 border-t-0"
                )}
            >
                <form onSubmit={manejarBusqueda} className="flex items-center gap-3 px-5 py-3">
                    <Search size={16} className="shrink-0 text-neutral-500" />
                    <input
                        ref={inputBusquedaRef}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Buscar productos..."
                        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-neutral-500"
                    />
                </form>
            </div>

            <div
                className={cn(
                    "overflow-hidden border-t border-white/10 transition-[max-height] duration-300 md:hidden",
                    menuAbierto ? "max-h-60" : "max-h-0 border-t-0"
                )}
            >
                <nav className="flex flex-col gap-1 px-5 py-3">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            to={link.href}
                            onClick={() => setMenuAbierto(false)}
                            className={cn(
                                "py-2 text-sm transition-colors hover:text-white",
                                esActivo(link.href) ? "text-white" : "text-neutral-400"
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
}
