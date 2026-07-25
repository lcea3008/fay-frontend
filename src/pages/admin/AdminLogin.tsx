import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
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
            <div className="w-full max-w-sm">
                <div className="mb-8 text-center">
                    <img src={logoFay} alt="FAY" className="mx-auto h-12 w-12 object-contain" />
                    <p className="mt-2 text-xs text-fay-gray">Panel de administrador</p>
                </div>

                <form onSubmit={manejarSubmit} className="space-y-4 rounded-xl border border-fay-border bg-fay-surface p-6">
                    <div>
                        <label className="mb-1.5 block text-xs text-fay-gray">Email</label>
                        <input
                            required
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@fay.com"
                            className="w-full rounded-lg border border-fay-border bg-fay-black px-4 py-2.5 text-sm outline-none focus:border-fay-accent"
                        />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-xs text-fay-gray">Contraseña</label>
                        <input
                            required
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full rounded-lg border border-fay-border bg-fay-black px-4 py-2.5 text-sm outline-none focus:border-fay-accent"
                        />
                    </div>

                    {error && <p className="text-xs text-fay-accent-light">{error}</p>}

                    <button
                        type="submit"
                        disabled={cargando}
                        className="w-full rounded-lg bg-fay-accent py-2.5 text-sm font-medium text-white transition-transform hover:scale-[1.01] disabled:opacity-60"
                    >
                        {cargando ? "Ingresando..." : "Iniciar sesión"}
                    </button>
                </form>
            </div>
        </main>
    );
}