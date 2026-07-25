import { useState } from "react";
import { Navigate, Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutDashboard, Shirt, Tag, BadgePercent, TrendingUp, LogOut, Menu, X } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import ToastContainer from "@/components/ui/ToastContainer";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import logoFay from "@/assets/logo-fay.png";

const NAV_ITEMS = [
    { to: "/fay-admin-access/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/fay-admin-access/productos", label: "Productos", icon: Shirt },
    { to: "/fay-admin-access/categorias", label: "Categorías", icon: Tag },
    { to: "/fay-admin-access/ofertas", label: "Ofertas", icon: BadgePercent },
    { to: "/fay-admin-access/populares", label: "Populares", icon: TrendingUp },
];

export default function AdminLayout() {
    const estaAutenticado = useAuthStore((s) => s.estaAutenticado);
    const cerrarSesion = useAuthStore((s) => s.cerrarSesion);
    const navigate = useNavigate();
    const location = useLocation();
    const [menuAbierto, setMenuAbierto] = useState(false);

    if (!estaAutenticado) {
        return <Navigate to="/fay-admin-access" replace />;
    }

    const manejarLogout = () => {
        cerrarSesion();
        navigate("/fay-admin-access");
    };

    return (
        <div className="flex min-h-screen flex-col bg-fay-black text-white md:flex-row">
            {/* Barra superior + menú desplegable, solo mobile */}
            <div className="flex items-center justify-between border-b border-fay-border px-4 py-3 md:hidden">
                <div className="flex items-center gap-2">
                    <img src={logoFay} alt="FAY" className="h-7 w-7 object-contain" />
                    <span className="text-lg font-semibold tracking-wide">FAY</span>
                </div>
                <button
                    aria-label="Abrir menú"
                    onClick={() => setMenuAbierto((v) => !v)}
                    className="text-fay-gray hover:text-white"
                >
                    {menuAbierto ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            <AnimatePresence>
                {menuAbierto && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMenuAbierto(false)}
                            className="fixed inset-0 z-50 bg-black/60 md:hidden"
                        />
                        <motion.aside
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "tween", duration: 0.3 }}
                            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-xs flex-col border-l border-fay-border bg-fay-black md:hidden"
                        >
                            <div className="flex items-center justify-between border-b border-fay-border px-5 py-4">
                                <h2 className="text-base font-medium">Menú</h2>
                                <button aria-label="Cerrar menú" onClick={() => setMenuAbierto(false)} className="text-fay-gray hover:text-white">
                                    <X size={20} />
                                </button>
                            </div>

                            <nav className="flex flex-1 flex-col gap-1 px-4 py-4">
                                {NAV_ITEMS.map((item) => {
                                    const activo = location.pathname === item.to;
                                    return (
                                        <Link
                                            key={item.to}
                                            to={item.to}
                                            onClick={() => setMenuAbierto(false)}
                                            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${activo ? "bg-fay-accent text-white" : "text-fay-gray hover:bg-fay-surface hover:text-white"
                                                }`}
                                        >
                                            <item.icon size={16} />
                                            {item.label}
                                        </Link>
                                    );
                                })}
                                <button
                                    onClick={manejarLogout}
                                    className="mt-auto flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-fay-gray transition-colors hover:bg-fay-surface hover:text-white"
                                >
                                    <LogOut size={16} />
                                    Cerrar sesión
                                </button>
                            </nav>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Sidebar completo, solo desktop */}
            <aside className="hidden w-60 shrink-0 flex-col border-r border-fay-border px-4 py-6 md:flex">
                <div className="mb-8 flex items-center gap-2 px-2">
                    <img src={logoFay} alt="FAY" className="h-7 w-7 object-contain" />
                    <div>
                        <span className="text-lg font-semibold tracking-wide">FAY</span>
                        <p className="text-xs text-fay-gray">Panel admin</p>
                    </div>
                </div>

                <nav className="flex flex-1 flex-col gap-1">
                    {NAV_ITEMS.map((item) => {
                        const activo = location.pathname === item.to;
                        return (
                            <Link
                                key={item.to}
                                to={item.to}
                                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${activo ? "bg-fay-accent text-white" : "text-fay-gray hover:bg-fay-surface hover:text-white"
                                    }`}
                            >
                                <item.icon size={16} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <button
                    onClick={manejarLogout}
                    className="mt-auto flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-fay-gray transition-colors hover:bg-fay-surface hover:text-white"
                >
                    <LogOut size={16} />
                    Cerrar sesión
                </button>
            </aside>

            <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
                <Outlet />
            </main>

            <ToastContainer />
            <ConfirmDialog />
        </div>
    );
}
