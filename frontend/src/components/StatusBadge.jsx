import { motion } from 'framer-motion';

const styles = {
    overdue: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    due_today: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    due_tomorrow: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    due_soon: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    upcoming: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    paid: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
};

const dotStyles = {
    overdue: 'bg-rose-400',
    due_today: 'bg-amber-400',
    due_tomorrow: 'bg-amber-300',
    due_soon: 'bg-orange-400',
    upcoming: 'bg-emerald-400',
    paid: 'bg-sky-400',
};

export default function StatusBadge({ status, className }) {
    const key = status?.key ?? 'upcoming';

    return (
        <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`badge border ${styles[key] ?? styles.upcoming} ${className ?? ''}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${dotStyles[key] ?? dotStyles.upcoming}`} />
            {status?.label ?? 'Upcoming'}
        </motion.span>
    );
}
