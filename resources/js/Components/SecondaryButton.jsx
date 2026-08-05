export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            type={type}
            className={
                `btn-secondary ${
                    disabled && 'opacity-50 pointer-events-none'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
