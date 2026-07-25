import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useToastStore, type TipoToast } from "@/store/useToastStore";

const ESTILOS_TIPO: Record<TipoToast, string> = {
    error: "border-fay-danger/40 bg-fay-danger-tint text-fay-danger-light",
    exito: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    info: "border-fay-border bg-fay-surface text-white",
};

export default function ToastContainer() {
    const { toasts, quitar } = useToastStore();

    return (
        <div className="fixed inset-x-4 bottom-5 z-[70] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-5 sm:items-end">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, y: 12, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={`flex w-full max-w-sm items-start justify-between gap-3 rounded-lg border px-4 py-3 text-sm shadow-lg ${ESTILOS_TIPO[toast.tipo]}`}
                    >
                        <span>{toast.mensaje}</span>
                        <button onClick={() => quitar(toast.id)} className="shrink-0 opacity-70 hover:opacity-100">
                            <X size={14} />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
