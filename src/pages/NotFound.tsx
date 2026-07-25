import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";

export default function NotFound() {
    return (
        <main className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">
            <Helmet>
                <title>Página no encontrada · FAY</title>
                <meta name="robots" content="noindex" />
            </Helmet>
            <p className="text-sm font-medium tracking-[0.2em] text-fay-accent-light">404</p>
            <h1 className="mt-3 text-2xl font-semibold md:text-3xl">Esta página no existe</h1>
            <p className="mt-2 max-w-sm text-sm text-fay-gray">
                Puede que el link esté roto o que la página haya sido movida. Vuelve al inicio para seguir explorando.
            </p>
            <LinkButton to="/" className="mt-6">
                <ArrowLeft size={15} />
                Volver al inicio
            </LinkButton>
        </main>
    );
}