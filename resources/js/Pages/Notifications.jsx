import { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { BellOff, Check, CheckCheck, Wallet } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/PageHeader';
import CategoryIcon from '@/Components/CategoryIcon';
import EmptyState from '@/Components/EmptyState';
import { relativeDay } from '@/helpers/dates';

function NotificationIcon({ item }) {
    const meta = item.meta ?? {};
    const color = meta.color ?? '#8b5cf6';
    const icon = meta.icon ?? 'bell';

    if (item.type === 'bill-due' || item.type === 'bill') {
        return (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: `${color}1a`, color }}>
                <CategoryIcon icon={icon} size={18} />
            </div>
        );
    }

    return (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
            <Wallet size={18} />
        </div>
    );
}

export default function Notifications({ notifications }) {
    const { unreadNotifications } = usePage().props;
    const [unread, setUnread] = useState(unreadNotifications ?? 0);

    const markRead = async (item) => {
        if (item.read_at) return;
        await axios.post(`/notifications/${item.id}/read`);
        setUnread((n) => Math.max(0, n - 1));
        router.reload({ only: ['unreadNotifications'] });
    };

    const markAllRead = async () => {
        if (unread === 0) return;
        await axios.post('/notifications/read-all');
        setUnread(0);
        router.reload({ only: ['unreadNotifications'] });
    };

    return (
        <AppLayout title="Notifications">
            <PageHeader
                title="Notifications"
                subtitle="Bill reminders and account activity"
                actions={
                    unread > 0 ? (
                        <button onClick={markAllRead} className="btn-secondary">
                            <CheckCheck size={16} /> Mark all read
                        </button>
                    ) : null
                }
            />

            {notifications.length === 0 ? (
                <EmptyState
                    icon="bell"
                    title="No notifications"
                    message="Upcoming bills will show up here as reminders."
                />
            ) : (
                <div className="card overflow-hidden">
                    <div className="flex items-center justify-between border-b border-white/5 px-5 py-3">
                        <p className="text-sm text-slate-400">
                            {unread > 0 ? `${unread} unread notification${unread === 1 ? '' : 's'}` : 'All caught up'}
                        </p>
                    </div>
                    <div className="divide-y divide-white/5">
                        {notifications.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: Math.min(index * 0.03, 0.6) }}
                                className="flex items-start gap-4 px-5 py-4"
                            >
                                <NotificationIcon item={item} />
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className={`font-medium ${item.read_at ? 'text-slate-400' : 'text-white'}`}>
                                            {item.title}
                                        </p>
                                        {!item.read_at && <span className="h-2 w-2 shrink-0 rounded-full bg-violet-400" />}
                                    </div>
                                    <p className="mt-0.5 text-sm text-slate-500">{item.body}</p>
                                    <p className="mt-1 text-xs text-slate-600">{relativeDay(item.created_at)}</p>
                                </div>
                                <div className="flex shrink-0 items-center gap-1">
                                    {item.url && (
                                        <Link href={item.url} className="btn-ghost !px-2.5 !py-2">
                                            View
                                        </Link>
                                    )}
                                    {!item.read_at && (
                                        <button onClick={() => markRead(item)} className="btn-ghost !px-2.5 !py-2 text-violet-400">
                                            <Check size={15} />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
