import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { dismissToast, subscribe } from '../store/toastStore';

const styles = {
    success: { icon: CheckCircle2, color: 'text-emerald-400', bar: 'bg-emerald-400' },
    error: { icon: AlertCircle, color: 'text-rose-400', bar: 'bg-rose-400' },
    info: { icon: Info, color: 'text-sky-400', bar: 'bg-sky-400' },
};

export default function ToastContainer() {
    const [toasts, setToasts] = useState([]);

    useEffect(() => subscribe(setToasts), []);

    return (
        <div className="pointer-events-none fixed right-4 bottom-4 z-[100] flex w-full max-w-sm flex-col gap-2">
            <AnimatePresence>
                {toasts.map((toast) => {
                    const { icon: Icon, color, bar } = styles[toast.type] ?? styles.info;

                    return (
                        <motion.div
                            key={toast.id}
                            layout
                            initial={{ opacity: 0, x: 60, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 60, scale: 0.9 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            className="pointer-events-auto relative overflow-hidden rounded-xl border border-white/10 bg-ink-800/95 p-4 pr-10 shadow-2xl shadow-black/50 backdrop-blur"
                        >
                            <div className="flex items-start gap-3">
                                <Icon size={20} className={`mt-0.5 shrink-0 ${color}`} />
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-white">{toast.title}</p>
                                    {toast.message ? (
                                        <p className="mt-0.5 text-sm text-slate-400">{toast.message}</p>
                                    ) : null}
                                </div>
                            </div>
                            <button
                                onClick={() => dismissToast(toast.id)}
                                className="absolute top-3 right-3 text-slate-500 transition-colors hover:text-white"
                            >
                                <X size={16} />
                            </button>
                            <div
                                className={`absolute bottom-0 left-0 h-0.5 w-full origin-left ${bar} opacity-70`}
                            />
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}
