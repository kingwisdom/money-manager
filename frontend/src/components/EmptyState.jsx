import { motion } from 'framer-motion';
import { CategoryIcon } from './CategoryIcon';

export default function EmptyState({ icon = 'tag', title, message, action }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-ink-900/40 px-6 py-14 text-center"
        >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-slate-500">
                <CategoryIcon icon={icon} size={26} />
            </div>
            <h3 className="text-base font-semibold text-white">{title}</h3>
            {message ? <p className="mt-1 max-w-xs text-sm text-slate-400">{message}</p> : null}
            {action ? <div className="mt-5">{action}</div> : null}
        </motion.div>
    );
}
