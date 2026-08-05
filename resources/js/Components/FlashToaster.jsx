import { useEffect, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import { pushToast } from '../store/toastStore';

export default function FlashToaster() {
    const { flash } = usePage().props;
    const lastFlash = useRef(null);

    useEffect(() => {
        if (!flash) return;

        if (lastFlash.current === JSON.stringify(flash)) return;

        lastFlash.current = JSON.stringify(flash);

        if (flash.success) {
            pushToast({ type: 'success', title: 'Done', message: flash.success });
        }

        if (flash.error) {
            pushToast({ type: 'error', title: 'Something went wrong', message: flash.error });
        }
    }, [flash]);

    return null;
}
