export default function InputError({ message, className = '', ...props }) {
    return message ? (
        <p
            {...props}
            className={'mt-1.5 text-xs text-rose-400 ' + className}
        >
            {message}
        </p>
    ) : null;
}
