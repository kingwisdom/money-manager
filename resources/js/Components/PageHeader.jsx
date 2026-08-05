import { motion } from 'framer-motion';

export default function PageHeader({ title, subtitle, actions }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
            <div>
                <h1 className="text-2xl font-bold text-white">{title}</h1>
                {subtitle ? <p className="mt-1 text-sm text-slate-400">{subtitle}</p> : null}
            </div>
            {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
        </motion.div>
    );
}
