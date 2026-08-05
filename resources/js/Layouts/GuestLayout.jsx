import { Link } from '@inertiajs/react';
import { Wallet } from 'lucide-react';

export default function GuestLayout({ children }) {
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-10">
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-32 -left-32 h-96 w-96 animate-float rounded-full bg-violet-600/15 blur-3xl" />
                <div className="absolute -right-40 -bottom-40 h-[28rem] w-[28rem] animate-float-delayed rounded-full bg-indigo-600/15 blur-3xl" />
            </div>

            <Link href="/" className="relative mb-8 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-xl shadow-violet-900/50">
                    <Wallet size={24} className="text-white" />
                </div>
                <div>
                    <p className="text-xl font-extrabold tracking-tight text-white">Money Manager</p>
                    <p className="text-xs text-slate-500">Your money, organized</p>
                </div>
            </Link>

            <div className="relative w-full max-w-md">
                <div className="card p-8">{children}</div>
            </div>
        </div>
    );
}
