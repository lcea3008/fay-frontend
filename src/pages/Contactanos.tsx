import { useState, type FormEvent } from "react";
import { abrirWhatsappConConsulta } from "@/lib/whatsapp";

export default function Contactanos() {
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [enviado, setEnviado] = useState(false);

    const manejarSubmit = (e: FormEvent) => {
        e.preventDefault();
        abrirWhatsappConConsulta(nombre, email, mensaje);
        setEnviado(true);
    };

    return (
        <main className="mx-auto max-w-xl px-5 py-14 md:px-8">
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
                    <div>
                        <label className="mb-1.5 block text-xs text-fay-gray">Nombre</label>
                        <input
                            required
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Tu nombre"
                            className="w-full rounded-lg border border-fay-border bg-fay-surface px-4 py-2.5 text-sm outline-none focus:border-fay-accent"
                        />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-xs text-fay-gray">Email</label>
                        <input
                            required
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="nombre@correo.com"
                            className="w-full rounded-lg border border-fay-border bg-fay-surface px-4 py-2.5 text-sm outline-none focus:border-fay-accent"
                        />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-xs text-fay-gray">Mensaje</label>
                        <textarea
                            required
                            rows={4}
                            value={mensaje}
                            onChange={(e) => setMensaje(e.target.value)}
                            placeholder="Escribe tu mensaje"
                            className="w-full rounded-lg border border-fay-border bg-fay-surface px-4 py-2.5 text-sm outline-none focus:border-fay-accent"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full rounded-lg bg-fay-accent py-3 text-sm font-medium text-white transition-transform hover:scale-[1.01]"
                    >
                        Enviar por WhatsApp
                    </button>
                </form>
            )}
        </main>
    );
}
