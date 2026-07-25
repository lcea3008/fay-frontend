import { Link } from "react-router-dom";
import { useConfiguracion } from "@/hooks/useConfiguracion";

const TIKTOK_FALLBACK = "https://www.tiktok.com/@fay0185";

export default function Footer() {
    const { configuracion } = useConfiguracion();
    const tiktokUrl = configuracion?.tiktok || TIKTOK_FALLBACK;
    const instagramUrl = configuracion?.instagram;

    return (
        <footer className="border-t border-white/10 bg-black">
            <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-4 md:px-8">
                <div>
                    <span className="text-lg font-semibold tracking-wide">FAY</span>
                    <p className="mt-3 max-w-xs text-sm leading-relaxed text-neutral-400">
                        Ropa deportiva para mujer, diseñada para moverte sin límites.
                    </p>
                </div>

                <div>
                    <h3 className="mb-3 text-sm font-medium">Tienda</h3>
                    <ul className="space-y-2 text-sm text-neutral-400">
                        <li><Link to="/productos" className="hover:text-white">Todos los productos</Link></li>
                        <li><Link to="/ofertas" className="hover:text-white">Ofertas</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="mb-3 text-sm font-medium">Marca</h3>
                    <ul className="space-y-2 text-sm text-neutral-400">
                        <li><Link to="/nosotros" className="hover:text-white">Nosotros</Link></li>
                        <li><Link to="/contactanos" className="hover:text-white">Contáctanos</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="mb-3 text-sm font-medium">Síguenos</h3>
                    <ul className="space-y-2 text-sm text-neutral-400">
                        <li>
                            {instagramUrl ? (
                                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                                    Instagram
                                </a>
                            ) : (
                                "Instagram"
                            )}
                        </li>
                        <li>
                            <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                                TikTok
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-neutral-400 md:px-8">
                © {new Date().getFullYear()} FAY. Todos los derechos reservados.
            </div>
        </footer>
    );
}