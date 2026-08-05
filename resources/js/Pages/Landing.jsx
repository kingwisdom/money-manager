import { motion } from 'framer-motion';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    Bell,
    BellRing,
    CalendarClock,
    CreditCard,
    FolderOpen,
    LogIn,
    PieChart,
    ReceiptText,
    ShieldCheck,
    Sparkles,
    TrendingDown,
    TrendingUp,
    Wallet,
    Zap,
} from 'lucide-react';

const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 0.55, ease: 'easeOut' },
};

const features = [
    {
        icon: CalendarClock,
        title: 'Never miss a bill',
        description:
            'Track subscriptions and bills by day-of-month due date with live countdowns — overdue, due today, due soon.',
        color: '#8b5cf6',
    },
    {
        icon: BellRing,
        title: 'Reminders that reach you',
        description:
            'Browser and in-app notifications nudge you before a bill is due, so you can pay it on time, every time.',
        color: '#f59e0b',
    },
    {
        icon: TrendingUp,
        title: 'Income & expenses',
        description:
            'Log what you earn and what you spend, grouped by category, and watch your monthly totals update instantly.',
        color: '#10b981',
    },
    {
        icon: PieChart,
        title: 'Monthly budgets',
        description:
            'Set a spending limit per expense category and see live progress bars that flag when you are about to go over.',
        color: '#3b82f6',
    },
    {
        icon: ReceiptText,
        title: 'One-tap payments',
        description:
            'Mark a bill as paid with a single click. The next due date rolls forward automatically — no math required.',
        color: '#ec4899',
    },
    {
        icon: FolderOpen,
        title: 'Organized categories',
        description:
            'Expense and income categories with icons and colors you choose, reused across bills, budgets and charts.',
        color: '#06b6d4',
    },
];

const steps = [
    {
        icon: Wallet,
        title: 'Create your account',
        description: 'Sign up in seconds. Your currency, categories and personal dashboard are set up for you.',
    },
    {
        icon: CalendarClock,
        title: 'Add your bills',
        description: 'Enter rent, subscriptions and recurring payments with their due day of month and amount.',
    },
    {
        icon: Sparkles,
        title: 'Stay ahead of the month',
        description: 'Get countdowns, reminders and budget alerts so nothing slips through the cracks.',
    },
];

export default function Landing() {
    return (
        <div className="relative min-h-screen overflow-x-hidden bg-ink-950 text-slate-200">
            <Head title="Money Manager — Your bills and budget, under control" />

            {/* Ambient background */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-violet-600/15 blur-3xl" />
                <div className="absolute top-1/3 -left-40 h-96 w-96 animate-float rounded-full bg-indigo-600/10 blur-3xl" />
                <div className="absolute top-2/3 -right-40 h-[28rem] w-[28rem] animate-float-delayed rounded-full bg-emerald-600/[0.08] blur-3xl" />
            </div>

            {/* Nav */}
            <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-ink-950/70 backdrop-blur-xl">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
                    <Link href={route('home')} className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-900/50">
                            <Wallet size={18} className="text-white" />
                        </div>
                        <span className="text-base font-extrabold tracking-tight text-white">Money Manager</span>
                    </Link>

                    <nav className="hidden items-center gap-8 text-sm font-medium text-slate-400 md:flex">
                        <a href="#features" className="transition-colors hover:text-white">Features</a>
                        <a href="#how-it-works" className="transition-colors hover:text-white">How it works</a>
                    </nav>

                    <div className="flex items-center gap-2">
                        <Link href={route('login')} className="btn-ghost hidden sm:inline-flex">
                            <LogIn size={16} /> Log in
                        </Link>
                        <Link href={route('register')} className="btn-primary !px-4 !py-2">
                            Get started
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section className="relative mx-auto max-w-6xl px-5 pt-20 pb-16 text-center sm:pt-28">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold text-violet-300"
                >
                    <Sparkles size={14} />
                    Bills · Budgets · Peace of mind
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.05 }}
                    className="mx-auto max-w-3xl text-4xl leading-tight font-extrabold tracking-tight text-white sm:text-6xl"
                >
                    Bills paid on time.{' '}
                    <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">
                        Budgets that hold.
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.12 }}
                    className="mx-auto mt-5 max-w-xl text-base text-slate-400 sm:text-lg"
                >
                    Money Manager tracks your recurring bills and subscriptions with live countdowns, reminds you
                    before they are due, and keeps your income, expenses and monthly budgets in one clean dashboard.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.2 }}
                    className="mt-8 flex flex-wrap items-center justify-center gap-3"
                >
                    <Link href={route('register')} className="btn-primary !px-6 !py-3 !text-base">
                        Create free account <ArrowRight size={18} />
                    </Link>
                    <a href="#how-it-works" className="btn-secondary !px-6 !py-3 !text-base">
                        See how it works
                    </a>
                </motion.div>
            </section>

            {/* Dashboard preview */}
            <section className="relative mx-auto max-w-6xl px-5 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="relative"
                >
                    <div className="absolute -inset-8 rounded-[2.5rem] bg-gradient-to-tr from-violet-600/20 via-transparent to-emerald-600/20 blur-2xl" />
                    <div className="card relative overflow-hidden p-6 backdrop-blur-2xl sm:p-8">
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/40 to-transparent" />

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                                    This month
                                </p>
                                <p className="mt-1 text-3xl font-extrabold text-white tabular-nums">$2,450.00</p>
                            </div>
                            <div className="flex gap-2">
                                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-right">
                                    <p className="text-[10px] font-semibold text-emerald-400 uppercase">Income</p>
                                    <p className="text-sm font-bold text-emerald-300 tabular-nums">$3,850</p>
                                </div>
                                <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-1.5 text-right">
                                    <p className="text-[10px] font-semibold text-rose-400 uppercase">Spent</p>
                                    <p className="text-sm font-bold text-rose-300 tabular-nums">$1,400</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 grid gap-4 lg:grid-cols-5">
                            <div className="lg:col-span-3">
                                <div className="rounded-xl border border-white/[0.06] bg-ink-900/60 p-4">
                                    <p className="mb-3 text-xs font-semibold tracking-wider text-slate-400 uppercase">
                                        Upcoming bills
                                    </p>
                                    <div className="space-y-2.5">
                                        <div className="flex items-center gap-3 rounded-lg bg-white/[0.03] px-3 py-2.5">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/15 text-violet-300">
                                                <Zap size={16} />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium text-white">Electricity</p>
                                                <p className="text-xs text-slate-500">$85.00 · every month</p>
                                            </div>
                                            <span className="rounded-full bg-rose-500/15 px-2.5 py-1 text-[11px] font-bold text-rose-400">
                                                Due in 2 days
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 rounded-lg bg-white/[0.03] px-3 py-2.5">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/15 text-sky-300">
                                                <ReceiptText size={16} />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium text-white">Internet</p>
                                                <p className="text-xs text-slate-500">$59.99 · every month</p>
                                            </div>
                                            <span className="rounded-full bg-amber-500/15 px-2.5 py-1 text-[11px] font-bold text-amber-400">
                                                Due tomorrow
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 rounded-lg bg-white/[0.03] px-3 py-2.5">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300">
                                                <ShieldCheck size={16} />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium text-white">Insurance</p>
                                                <p className="text-xs text-slate-500">$320.00 · every year</p>
                                            </div>
                                            <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-bold text-emerald-400">
                                                Paid ✓
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-2">
                                <div className="flex h-full flex-col gap-4">
                                    <div className="rounded-xl border border-white/[0.06] bg-ink-900/60 p-4">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                                                Groceries budget
                                            </p>
                                            <p className="text-xs font-bold text-white tabular-nums">$342 / $400</p>
                                        </div>
                                        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/5">
                                            <div className="h-full w-[85%] rounded-full bg-gradient-to-r from-violet-500 to-indigo-400" />
                                        </div>
                                    </div>
                                    <div className="rounded-xl border border-white/[0.06] bg-ink-900/60 p-4">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                                                Reminders
                                            </p>
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                                                2
                                            </span>
                                        </div>
                                        <div className="mt-3 space-y-2">
                                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                                <Bell size={13} className="text-amber-400" /> Internet due tomorrow
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                                <Bell size={13} className="text-amber-400" /> Electricity due in 2 days
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Features */}
            <section id="features" className="relative mx-auto max-w-6xl scroll-mt-20 px-5 py-20">
                <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                        Everything to take control of the month
                    </h2>
                    <p className="mt-3 text-slate-400">
                        A focused toolkit for recurring bills, spending and budgeting — without the clutter.
                    </p>
                </motion.div>

                <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            {...fadeUp}
                            transition={{ duration: 0.5, delay: index * 0.06 }}
                            className="card card-hover p-6"
                        >
                            <div
                                className="flex h-11 w-11 items-center justify-center rounded-xl"
                                style={{ backgroundColor: `${feature.color}1a`, color: feature.color }}
                            >
                                <feature.icon size={20} />
                            </div>
                            <h3 className="mt-4 text-base font-bold text-white">{feature.title}</h3>
                            <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* How it works */}
            <section id="how-it-works" className="relative mx-auto max-w-6xl scroll-mt-20 px-5 py-20">
                <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">How it works</h2>
                    <p className="mt-3 text-slate-400">Up and running in less than a minute.</p>
                </motion.div>

                <div className="relative mt-14 grid gap-10 md:grid-cols-3">
                    <div className="pointer-events-none absolute top-7 right-[16%] left-[16%] hidden h-px bg-gradient-to-r from-violet-500/40 to-emerald-500/40 md:block" />
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.title}
                            {...fadeUp}
                            transition={{ duration: 0.5, delay: index * 0.12 }}
                            className="relative text-center"
                        >
                            <div className="relative z-10 mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-xl shadow-violet-900/50">
                                <step.icon size={24} className="text-white" />
                            </div>
                            <div className="mt-5 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-white/5 px-2 text-xs font-bold text-violet-300">
                                {index + 1}
                            </div>
                            <h3 className="mt-3 text-base font-bold text-white">{step.title}</h3>
                            <p className="mx-auto mt-1.5 max-w-xs text-sm leading-relaxed text-slate-400">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Demo / CTA */}
            <section className="relative mx-auto max-w-6xl px-5 py-20">
                <motion.div {...fadeUp} className="card relative overflow-hidden p-8 text-center sm:p-12">
                    <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[32rem] -translate-x-1/2 rounded-full bg-violet-600/20 blur-3xl" />

                    <h2 className="relative text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                        Ready to stop chasing bills?
                    </h2>
                    <p className="relative mx-auto mt-3 max-w-lg text-slate-400">
                        Create your account free. Try the live demo with{' '}
                        <code className="rounded bg-white/5 px-1.5 py-0.5 text-xs text-violet-300">demo@money.com</code>{' '}
                        / <code className="rounded bg-white/5 px-1.5 py-0.5 text-xs text-violet-300">password</code>.
                    </p>
                    <div className="relative mt-7 flex flex-wrap items-center justify-center gap-3">
                        <Link href={route('register')} className="btn-primary !px-6 !py-3 !text-base">
                            Get started free <ArrowRight size={18} />
                        </Link>
                        <Link href={route('login')} className="btn-secondary !px-6 !py-3 !text-base">
                            Log in
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="relative border-t border-white/[0.06] py-10">
                <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 sm:flex-row">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600">
                            <Wallet size={15} className="text-white" />
                        </div>
                        <span className="text-sm font-bold text-white">Money Manager</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-slate-500">
                        <a href="#features" className="transition-colors hover:text-white">Features</a>
                        <a href="#how-it-works" className="transition-colors hover:text-white">How it works</a>
                        <Link href={route('login')} className="transition-colors hover:text-white">Log in</Link>
                        <Link href={route('register')} className="transition-colors hover:text-white">Register</Link>
                    </div>
                    <p className="text-xs text-slate-600">Bills · Budgets · Peace of mind</p>
                </div>
            </footer>
        </div>
    );
}
