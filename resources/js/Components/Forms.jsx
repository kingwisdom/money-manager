import { forwardRef } from 'react';
import { motion } from 'framer-motion';

export const Field = ({ label, children, className }) => (
    <div className={className}>
        {label ? <label className="label">{label}</label> : null}
        {children}
    </div>
);

export const Input = forwardRef(function Input({ className, ...props }, ref) {
    return <input ref={ref} className={`input ${className ?? ''}`} {...props} />;
});

export const Select = forwardRef(function Select({ className, children, ...props }, ref) {
    return (
        <select ref={ref} className={`input appearance-none ${className ?? ''}`} {...props}>
            {children}
        </select>
    );
});

export const Textarea = forwardRef(function Textarea({ className, ...props }, ref) {
    return <textarea ref={ref} className={`input ${className ?? ''}`} {...props} />;
});

export const Toggle = ({ checked, onChange, label }) => (
    <label className="flex cursor-pointer items-center justify-between gap-3">
        <span className="text-sm font-medium text-slate-300">{label}</span>
        <button
            type="button"
            onClick={() => onChange(!checked)}
            className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${
                checked ? 'bg-violet-500' : 'bg-ink-600/70'
            }`}
        >
            <motion.span
                layout
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow ${
                    checked ? 'left-[22px]' : 'left-0.5'
                }`}
            />
        </button>
    </label>
);

export const ErrorText = ({ message }) =>
    message ? <p className="mt-1.5 text-xs text-rose-400">{message}</p> : null;
