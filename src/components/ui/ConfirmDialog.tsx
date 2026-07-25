import { AnimatePresence, motion } from "framer-motion";
import { useConfirmStore } from "@/store/useConfirmStore";
import { Button } from "@/components/ui/Button";

export default function ConfirmDialog() {
    const { abierto, titulo, mensaje, textoConfirmar, responder } = useConfirmStore();

    return (
        <AnimatePresence>
            {abierto && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => responder(false)}
                        className="fixed inset-0 z-[60] bg-black/60"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="fixed left-1/2 top-1/2 z-[60] w-[calc(100%-2.5rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl border border-fay-border bg-fay-surface p-6"
                    >
                        <h2 className="text-base font-medium">{titulo}</h2>
                        <p className="mt-2 text-sm text-fay-gray">{mensaje}</p>
                        <div className="mt-6 flex justify-end gap-3">
                            <Button variant="ghost" size="sm" onClick={() => responder(false)}>
                                Cancelar
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => responder(true)}>
                                {textoConfirmar}
                            </Button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
