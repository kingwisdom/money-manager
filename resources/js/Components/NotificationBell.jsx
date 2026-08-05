import { useEffect, useRef, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, BellRing } from 'lucide-react';
import axios from 'axios';
import { pushToast } from '../store/toastStore';
import { relativeDay } from '../helpers/dates';

export function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().catch(() => {});
    }
}

function notify(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
        try {
            new Notification(title, { body, tag: 'bill-due' });
        } catch {
            // ignore
        }
    }
}

export default function NotificationBell() {
    const { unreadNotifications, auth } = usePage().props;
    const [open, setOpen] = useState(false);
    const [recent, setRecent] = useState([]);
    const [localUnread, setLocalUnread] = useState(unreadNotifications ?? 0);
    const [loaded, setLoaded] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        setLocalUnread(unreadNotifications ?? 0);
    }, [unreadNotifications]);

    useEffect(() => {
        if (!auth?.user) return;

        const interval = setInterval(async () => {
            try {
                const { data } = await axios.get('/notifications/poll');

                if (data.new?.length) {
                    data.new.forEach((n) => {
                        pushToast({ type: 'info', title: n.title, message: n.body });
                        notify(n.title, n.body);
                    });
                }

                setLocalUnread(data.unread ?? 0);
                setRecent(data.recent ?? []);
            } catch {
                // ignore
            }
        }, 60_000);

        return () => clearInterval(interval);
    }, [auth?.user]);

    useEffect(() => {
        const onClick = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };

        document.addEventListener('click', onClick);

        return () => document.removeEventListener('click', onClick);
    }, []);

    const openDropdown = async () => {
        requestNotificationPermission();

        const next = !open;
        setOpen(next);

        if (next && !loaded) {
            try {
                const { data } = await axios.get('/notifications/poll');
                setRecent(data.recent ?? []);
                setLoaded(true);
            } catch {
                // ignore
            }
        }
    };

    const markAllRead = async () => {
        await axios.post('/notifications/read-all');
        setLocalUnread(0);
        setRecent((items) => items.map((item) => ({ ...item, read_at: new Date().toISOString() })));
        router.reload({ only: ['unreadNotifications'] });
    };

    const hasUnread = localUnread > 0;

    return (
        <div ref={dropdownRef} className="relative">
            <button
                onClick={openDropdown}
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-ink-800/80 text-slate-300 transition-colors hover:border-white/20 hover:text-white"
                aria-label="Notifications"
            >
                {hasUnread ? <BellRing size={18} /> : <Bell size={18} />}
                {hasUnread ? (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-lg shadow-rose-500/40"
                    >
                        {localUnread > 99 ? '99+' : localUnread}
                    </motion.span>
                ) : null}
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-white/10 bg-ink-850 shadow-2xl shadow-black/60"
                    >
                        <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
                            <p className="text-sm font-bold text-white">Notifications</p>
                            {hasUnread ? (
                                <button
                                    onClick={markAllRead}
                                    className="text-xs font-medium text-violet-400 hover:text-violet-300"
                                >
                                    Mark all read
                                </button>
                            ) : null}
                        </div>

                        <div className="max-h-80 overflow-y-auto">
                            {recent.length === 0 ? (
                                <p className="px-4 py-8 text-center text-sm text-slate-500">
                                    You're all caught up.
                                </p>
                            ) : (
                                recent.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={item.url ?? '/notifications'}
                                        onClick={() => setOpen(false)}
                                        className="block border-b border-white/5 px-4 py-3 transition-colors hover:bg-white/[0.03]"
                                    >
                                        <div className="flex items-start gap-2">
                                            <span
                                                className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                                                    item.read_at ? 'bg-slate-600' : 'bg-violet-400'
                                                }`}
                                            />
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-white">
                                                    {item.title}
                                                </p>
                                                <p className="mt-0.5 text-xs text-slate-400">{item.body}</p>
                                                <p className="mt-1 text-[11px] text-slate-500">
                                                    {relativeDay(item.created_at)}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>

                        <div className="border-t border-white/5 p-2">
                            <Link
                                href="/notifications"
                                onClick={() => setOpen(false)}
                                className="block rounded-xl px-3 py-2 text-center text-sm font-semibold text-violet-400 transition-colors hover:bg-white/5"
                            >
                                View all
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
