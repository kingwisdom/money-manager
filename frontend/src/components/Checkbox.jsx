export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'h-4 w-4 rounded border-white/15 bg-ink-700 text-violet-500 focus:ring-violet-500/40 focus:ring-offset-0 ' +
                className
            }
        />
    );
}
