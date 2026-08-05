import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function Modal({ show, onClose, title, children, maxWidth = 'max-w-lg' }) {
    useEffect(() => {
        if (!show) return;

        const onKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', onKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = '';
        };
    }, [show, onClose]);

    return (
        <AnimatePresence>
            {show && (
                <div className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 30, scale: 0.97 }}
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                        className={`relative w-full ${maxWidth} rounded-t-2xl border border-white/10 bg-ink-850 shadow-2xl shadow-black/60 sm:rounded-2xl`}
                    >
                        <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
                            <h3 className="text-base font-bold text-white">{title}</h3>
                            <button
                                onClick={onClose}
                                className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="max-h-[75vh] overflow-y-auto px-6 py-5">{children}</div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
