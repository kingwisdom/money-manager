let listeners = [];
let toasts = [];
let counter = 0;

export function pushToast({ type = 'success', title, message }) {
    const toast = { id: ++counter, type, title, message };

    toasts = [...toasts, toast];

    listeners.forEach((fn) => fn(toasts));

    setTimeout(() => dismissToast(toast.id), 5000);

    return toast.id;
}

export function dismissToast(id) {
    toasts = toasts.filter((toast) => toast.id !== id);

    listeners.forEach((fn) => fn(toasts));
}

export function subscribe(fn) {
    listeners.push(fn);

    return () => {
        listeners = listeners.filter((listener) => listener !== fn);
    };
}

export function getToasts() {
    return toasts;
}
