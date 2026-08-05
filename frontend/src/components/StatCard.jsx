import { motion } from 'framer-motion';
import AnimatedNumber from './AnimatedNumber';

export default function StatCard({ label, value, format, icon, accent = 'violet', sub, index = 0 }) {
    const accents = {
        violet: 'from-violet-500/20 to-indigo-500/5 text-violet-400',
        emerald: 'from-emerald-500/20 to-teal-500/5 text-emerald-400',
        rose: 'from-rose-500/20 to-orange-500/5 text-rose-400',
        amber: 'from-amber-500/20 to-yellow-500/5 text-amber-400',
        sky: 'from-sky-500/20 to-cyan-500/5 text-sky-400',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.45, ease: 'easeOut' }}
            className="card card-hover p-5"
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">{label}</p>
                    <p className="mt-2 text-2xl font-bold text-white tabular-nums">
                        <AnimatedNumber
                            value={value ?? 0}
                            format={format ?? ((v) => Number(v).toFixed(2))}
                        />
                    </p>
                    {sub ? <p className="mt-1 text-xs text-slate-500">{sub}</p> : null}
                </div>
                <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${accents[accent] ?? accents.violet}`}
                >
                    {icon}
                </div>
            </div>
        </motion.div>
    );
}
