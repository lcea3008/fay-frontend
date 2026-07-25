import Hero from "@/components/home/Hero";
import OfertasBanner from "@/components/home/OfertasBanner";
import ProductosDestacados from "@/components/home/ProductosDestacados";

export default function Home() {
    return (
        <main>
            <Hero />
            <OfertasBanner />
            <ProductosDestacados />
        </main>
    );
}