import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    CreditCard,
    FolderOpen,
    LayoutDashboard,
    LogOut,
    Menu,
    PieChart,
    ReceiptText,
    Settings,
    TrendingUp,
    Wallet,
    X,
} from 'lucide-react';
import NotificationBell from '../Components/NotificationBell';
import ToastContainer from '../Components/ToastContainer';
import FlashToaster from '../Components/FlashToaster';

const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Bills', href: '/bills', icon: ReceiptText },
    { name: 'Income', href: '/incomes', icon: TrendingUp },
    { name: 'Expenses', href: '/expenses', icon: CreditCard },
    { name: 'Budgets', href: '/budgets', icon: PieChart },
    { name: 'Categories', href: '/categories', icon: FolderOpen },
];

export default function AppLayout({ children, title }) {
    const { auth } = usePage().props;
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { url } = usePage();

    const initials = auth.user?.initials ?? 'U';

    const logout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    const sidebar = (
        <div className="flex h-full flex-col">
            <div className="flex items-center gap-3 px-5 py-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-900/50">
                    <Wallet size={20} className="text-white" />
                </div>
                <div>
                    <p className="text-base font-extrabold tracking-tight text-white">Money Manager</p>
                    <p className="text-[11px] text-slate-500">Your money, organized</p>
                </div>
            </div>

            <nav className="mt-2 flex-1 space-y-1 px-3">
                {navItems.map(({ name, href, icon: Icon }) => {
                    const active = url === href || url.startsWith(`${href}/`);

                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`nav-link ${active ? 'nav-link-active' : ''}`}
                            onClick={() => setDrawerOpen(false)}
                        >
                            <Icon size={18} />
                            {name}
                            {active ? (
                                <motion.span
                                    layoutId="nav-indicator"
                                    className="ml-auto h-2 w-2 rounded-full bg-violet-400"
                                />
                            ) : null}
                        </Link>
                    );
                })}
            </nav>

            <div className="border-t border-white/5 p-3">
                <Link href="/profile" className="nav-link">
                    <Settings size={18} />
                    Settings
                </Link>
                <button onClick={logout} className="nav-link w-full">
                    <LogOut size={18} />
                    Sign out
                </button>
            </div>
        </div>
    );

    return (
        <div className="relative min-h-screen">
            <Head title={title} />

            {/* Ambient background */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-32 -left-32 h-96 w-96 animate-float rounded-full bg-violet-600/10 blur-3xl" />
                <div className="absolute top-1/3 -right-40 h-[28rem] w-[28rem] animate-float-delayed rounded-full bg-indigo-600/10 blur-3xl" />
                <div className="absolute -bottom-40 left-1/3 h-96 w-96 animate-float rounded-full bg-emerald-600/[0.07] blur-3xl" />
            </div>

            {/* Desktop sidebar */}
            <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-white/[0.06] bg-ink-900/70 backdrop-blur-xl lg:block">
                {sidebar}
            </aside>

            {/* Mobile drawer */}
            <AnimatePresence>
                {drawerOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setDrawerOpen(false)}
                            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: 'spring', stiffness: 350, damping: 32 }}
                            className="fixed inset-y-0 left-0 z-50 w-64 border-r border-white/[0.06] bg-ink-900 lg:hidden"
                        >
                            <button
                                onClick={() => setDrawerOpen(false)}
                                className="absolute top-5 right-4 text-slate-400 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                            {sidebar}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main column */}
            <div className="relative z-10 lg:pl-64">
                {/* Topbar */}
                <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-ink-950/70 backdrop-blur-xl">
                    <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setDrawerOpen(true)}
                                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-ink-800/80 text-slate-300 lg:hidden"
                            >
                                <Menu size={18} />
                            </button>
                            <p className="text-sm font-semibold text-slate-400">
                                {new Date().toLocaleDateString(undefined, {
                                    weekday: 'long',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <NotificationBell />
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-bold text-white">
                                {initials}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content with transitions */}
                <main className="px-4 py-6 sm:px-6 lg:px-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={url}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>

                {/* Mobile bottom nav */}
                <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.06] bg-ink-900/90 backdrop-blur-xl lg:hidden">
                    <div className="grid grid-cols-4">
                        {navItems.slice(0, 4).map(({ name, href, icon: Icon }) => {
                            const active = url === href;

                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors ${
                                        active ? 'text-violet-400' : 'text-slate-500'
                                    }`}
                                >
                                    <Icon size={19} />
                                    {name}
                                </Link>
                            );
                        })}
                    </div>
                </nav>
                <div className="h-16 lg:hidden" />
            </div>

            <FlashToaster />
            <ToastContainer />
        </div>
    );
}
