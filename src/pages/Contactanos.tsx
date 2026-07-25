import { useState, type FormEvent } from "react";
import { Helmet } from "react-helmet-async";
import { abrirWhatsappConConsulta } from "@/lib/whatsapp";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useConfiguracion } from "@/hooks/useConfiguracion";

export default function Contactanos() {
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [enviado, setEnviado] = useState(false);
    const { configuracion } = useConfiguracion();

    const manejarSubmit = (e: FormEvent) => {
        e.preventDefault();
        abrirWhatsappConConsulta(nombre, email, mensaje, configuracion?.whatsapp);
        setEnviado(true);
    };

    return (
        <main className="mx-auto max-w-xl px-5 py-14 md:px-8">
            <Helmet>
                <title>Contáctanos · FAY</title>
                <meta name="description" content="Escribinos por WhatsApp — te respondemos rápido para ayudarte con tu pedido de ropa deportiva." />
            </Helmet>
            <h1 className="text-3xl font-semibold">Contáctanos</h1>
            <p className="mt-2 text-sm text-fay-gray">
                ¿Tienes una consulta? Escríbenos y te responderemos a la brevedad por WhatsApp.
            </p>

            {enviado ? (
                <div className="mt-8 rounded-xl border border-fay-accent/30 bg-fay-accent-tint p-5 text-sm text-fay-accent-light">
                    Te llevamos a WhatsApp con tu mensaje ya armado. Si no se abrió, revisa que tu navegador no haya bloqueado la ventana.
                </div>
            ) : (
                <form className="mt-8 space-y-4" onSubmit={manejarSubmit}>
                    <Input
                        label="Nombre"
                        required
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Tu nombre"
                        className="py-2.5"
                    />
                    <Input
                        label="Email"
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nombre@correo.com"
                        className="py-2.5"
                    />
                    <Textarea
                        label="Mensaje"
                        required
                        rows={4}
                        value={mensaje}
                        onChange={(e) => setMensaje(e.target.value)}
                        placeholder="Escribe tu mensaje"
                        className="py-2.5"
                    />
                    <Button type="submit" size="lg" fullWidth>
                        Enviar por WhatsApp
                    </Button>
                </form>
            )}
        </main>
    );
}
