import { useEffect, useState, type FormEvent } from "react";
import { Helmet } from "react-helmet-async";
import { useConfiguracion } from "@/hooks/useConfiguracion";
import { useAuthStore } from "@/store/useAuthStore";
import { api } from "@/lib/api";
import { mostrarToast } from "@/store/useToastStore";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { Configuracion } from "@/types";

export default function AdminConfiguracion() {
    const { configuracion, cargando } = useConfiguracion();
    const token = useAuthStore((s) => s.token);
    const [guardando, setGuardando] = useState(false);

    const [whatsapp, setWhatsapp] = useState("");
    const [instagram, setInstagram] = useState("");
    const [tiktok, setTiktok] = useState("");

    useEffect(() => {
        if (!configuracion) return;
        setWhatsapp(configuracion.whatsapp ?? "");
        setInstagram(configuracion.instagram ?? "");
        setTiktok(configuracion.tiktok ?? "");
    }, [configuracion]);

    const manejarSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!token) return;

        setGuardando(true);
        try {
            await api.put<Configuracion>("/configuracion", { whatsapp, instagram, tiktok }, token);
            mostrarToast("Configuración guardada.", "exito");
        } catch {
            mostrarToast("No se pudo guardar la configuración.", "error");
        } finally {
            setGuardando(false);
        }
    };

    return (
        <div>
            <Helmet>
                <title>Configuración · Panel admin</title>
            </Helmet>
            <h1 className="text-2xl font-semibold">Configuración</h1>
            <p className="mt-1 text-sm text-fay-gray">
                Datos de contacto que se usan en todo el sitio público.
            </p>

            {cargando ? (
                <p className="mt-6 text-sm text-fay-gray">Cargando...</p>
            ) : (
                <form
                    onSubmit={manejarSubmit}
                    className="mt-6 max-w-md space-y-4 rounded-xl border border-fay-border bg-fay-surface p-6"
                >
                    <div>
                        <Input
                            label="Número de WhatsApp"
                            value={whatsapp}
                            onChange={(e) => setWhatsapp(e.target.value)}
                            placeholder="51987654321"
                            className="bg-fay-black"
                        />
                        <p className="mt-1.5 text-xs text-fay-gray">
                            Con código de país, sin "+" ni espacios. Se usa en el botón de WhatsApp del carrito y de Contáctanos.
                        </p>
                    </div>

                    <Input
                        label="Instagram"
                        value={instagram}
                        onChange={(e) => setInstagram(e.target.value)}
                        placeholder="https://instagram.com/fay"
                        className="bg-fay-black"
                    />

                    <Input
                        label="TikTok"
                        value={tiktok}
                        onChange={(e) => setTiktok(e.target.value)}
                        placeholder="https://www.tiktok.com/@fay0185"
                        className="bg-fay-black"
                    />

                    <Button type="submit" loading={guardando} fullWidth>
                        Guardar cambios
                    </Button>
                </form>
            )}
        </div>
    );
}
