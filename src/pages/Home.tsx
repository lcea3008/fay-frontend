import { Helmet } from "react-helmet-async";
import Hero from "@/components/home/Hero";
import OfertasBanner from "@/components/home/OfertasBanner";
import ProductosDestacados from "@/components/home/ProductosDestacados";

export default function Home() {
    return (
        <>
            <Helmet>
                <title>FAY · Ropa deportiva para mujer</title>
                <meta
                    name="description"
                    content="Ropa deportiva para mujer en Perú: leggings, tops, conjuntos y casacas pensados para moverte sin límites. Pedidos fáciles por WhatsApp."
                />
            </Helmet>
            <main>
                <Hero />
                <OfertasBanner />
                <ProductosDestacados />
            </main>
        </>
    );
}