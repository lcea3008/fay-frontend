import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";

export default function Hero() {
    return (
        <section className="relative mx-auto max-w-7xl overflow-hidden px-5 pt-10 md:px-8 md:pt-14">
            <div className="grid items-center gap-10 md:grid-cols-2">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <p className="mb-3 text-xs font-medium tracking-[0.2em] text-fay-accent-light">
                        NUEVA COLECCIÓN
                    </p>
                    <h1 className="text-4xl font-semibold leading-[1.05] md:text-6xl">
                        Ropa deportiva
                        <br />
                        hecha para moverte
                    </h1>
                    <p className="mt-5 max-w-md text-sm leading-relaxed text-fay-gray md:text-base">
                        Diseños femeninos, funcionales y con actitud. Entrena, camina y vive
                        sin límites con activewear pensado para tu cuerpo en movimiento.
                    </p>
                    <div className="mt-8 flex items-center gap-4">
                        <LinkButton to="/productos" size="lg" className="group">
                            Ver colección
                            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                        </LinkButton>
                        <Link
                            to="/nosotros"
                            className="text-sm text-fay-gray transition-colors hover:text-white"
                        >
                            Conoce FAY
                        </Link>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-fay-surface"
                >
                    <img
                        src="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1000&q=80"
                        alt="Mujer usando activewear FAY"
                        className="h-full w-full object-cover"
                    />
                </motion.div>
            </div>
        </section>
    );
}