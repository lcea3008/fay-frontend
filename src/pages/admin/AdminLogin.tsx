import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuthStore } from "@/store/useAuthStore";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import logoFay from "@/assets/logo-fay.png";

export default function AdminLogin() {
    const navigate = useNavigate();
    const iniciarSesion = useAuthStore((s) => s.iniciarSesion);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

    const manejarSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setCargando(true);
        setError("");

        const exito = await iniciarSesion(email, password);

        if (exito) {
            navigate("/fay-admin-access/dashboard");
        } else {
            setError("Credenciales incorrectas.");
        }
        setCargando(false);
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-fay-black px-5 text-white">
            <Helmet>
                <title>Panel admin · FAY</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <div className="w-full max-w-sm">
                <div className="mb-8 text-center">
                    <img src={logoFay} alt="FAY" className="mx-auto h-12 w-12 object-contain" />
                    <p className="mt-2 text-xs text-fay-gray">Panel de administrador</p>
                </div>

                <form onSubmit={manejarSubmit} className="space-y-4 rounded-xl border border-fay-border bg-fay-surface p-6">
                    <Input
                        label="Email"
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@fay.com"
                        className="bg-fay-black px-4 py-2.5"
                    />
                    <Input
                        label="Contraseña"
                        required
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="bg-fay-black px-4 py-2.5"
                    />

                    {error && <p className="text-xs text-fay-danger-light">{error}</p>}

                    <Button type="submit" loading={cargando} fullWidth>
                        {cargando ? "Ingresando..." : "Iniciar sesión"}
                    </Button>
                </form>
            </div>
        </main>
    );
}