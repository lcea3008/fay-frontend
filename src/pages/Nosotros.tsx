import { Helmet } from "react-helmet-async";

export default function Nosotros() {
    return (
        <main className="mx-auto max-w-7xl px-5 py-14 md:px-8">
            <Helmet>
                <title>Nosotros · FAY</title>
                <meta name="description" content="Conocé FAY: activewear femenino diseñado para cuerpos reales en movimiento, con tejidos técnicos y actitud." />
            </Helmet>
            <div className="grid items-center gap-10 md:grid-cols-2">
                <div>
                    <p className="mb-3 text-xs font-medium tracking-[0.2em] text-fay-accent-light">
                        NUESTRA HISTORIA
                    </p>
                    <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
                        Ropa que se mueve contigo
                    </h1>
                    <p className="mt-5 text-sm leading-relaxed text-fay-gray md:text-base">
                        FAY nace de una idea simple: el activewear femenino debería sentirse
                        tan bien como se ve. Diseñamos cada prenda pensando en cuerpos reales
                        en movimiento, con tejidos técnicos y una estética que no sacrifica
                        personalidad por funcionalidad.
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-fay-gray md:text-base">
                        Creemos en el entrenamiento como una forma de expresión, no una
                        obligación. Por eso cada colección busca acompañarte, ya sea en el
                        estudio, en la calle o en tu rutina diaria.
                    </p>
                </div>
                <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-fay-surface">
                    <img
                        src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1000&q=80"
                        alt="Equipo FAY"
                        className="h-full w-full object-cover"
                    />
                </div>
            </div>
        </main>
    );
}