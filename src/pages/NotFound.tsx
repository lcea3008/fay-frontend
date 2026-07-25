import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <main className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">
            <p className="text-sm font-medium tracking-[0.2em] text-fay-accent-light">404</p>
            <h1 className="mt-3 text-2xl font-semibold md:text-3xl">Esta página no existe</h1>
            <p className="mt-2 max-w-sm text-sm text-fay-gray">
                Puede que el link esté roto o que la página haya sido movida. Vuelve al inicio para seguir explorando.
            </p>
            <Link
                to="/"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-fay-accent px-5 py-2.5 text-sm font-medium text-white transition-transform hover:scale-[1.02]"
            >
                <ArrowLeft size={15} />
                Volver al inicio
            </Link>
        </main>
    );
}