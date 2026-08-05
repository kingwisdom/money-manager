export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `btn-primary ${
                    disabled && 'opacity-50 pointer-events-none'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
