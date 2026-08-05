import { useEffect, useRef } from 'react';
import { animate, useMotionValue, useTransform, motion } from 'framer-motion';

export default function AnimatedNumber({ value, format, className }) {
    const ref = useRef(null);
    const motionValue = useMotionValue(0);
    const display = useTransform(motionValue, (v) => (format ? format(v) : String(v)));

    useEffect(() => {
        const controls = animate(motionValue, Number(value), {
            duration: 0.8,
            ease: 'easeOut',
        });

        return controls.stop;
    }, [value, motionValue]);

    return <motion.span ref={ref} className={className}>{display}</motion.span>;
}
