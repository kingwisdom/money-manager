import { motion } from 'framer-motion';

export default function ProgressBar({ value, color = '#8b5cf6', className, height = 'h-2' }) {
    const percent = Math.min(100, Math.max(0, Number(value) || 0));

    return (
        <div className={`w-full overflow-hidden rounded-full bg-white/[0.06] ${height} ${className ?? ''}`}>
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{
                    background: `linear-gradient(90deg, ${color}88, ${color})`,
                    boxShadow: `0 0 12px ${color}55`,
                }}
            />
        </div>
    );
}
