import { useEffect, useState } from 'react';

function pad(value) {
    return String(value).padStart(2, '0');
}

function diffParts(targetDate) {
    const now = new Date();
    const target = new Date(targetDate);
    let diff = target.getTime() - now.getTime();

    if (diff < 0) diff = 0;

    const days = Math.floor(diff / 86_400_000);
    const hours = Math.floor((diff % 86_400_000) / 3_600_000);
    const minutes = Math.floor((diff % 3_600_000) / 60_000);
    const seconds = Math.floor((diff % 60_000) / 1000);

    return { days, hours, minutes, seconds };
}

export default function Countdown({ nextDue, urgent }) {
    const [parts, setParts] = useState(() => diffParts(nextDue));

    useEffect(() => {
        setParts(diffParts(nextDue));

        const interval = setInterval(() => setParts(diffParts(nextDue)), 1000);

        return () => clearInterval(interval);
    }, [nextDue]);

    return (
        <div className={`flex items-center gap-2 tabular-nums ${urgent ? 'animate-pulse-soft' : ''}`}>
            <span className="inline-flex min-w-[2.25rem] flex-col items-center rounded-lg bg-white/[0.06] px-1.5 py-1">
                <span className="text-sm leading-none font-bold text-white">{parts.days}</span>
                <span className="mt-0.5 text-[10px] text-slate-400">days</span>
            </span>
            <span className="text-slate-500">:</span>
            <span className="inline-flex min-w-[2.25rem] flex-col items-center rounded-lg bg-white/[0.06] px-1.5 py-1">
                <span className="text-sm leading-none font-bold text-white">{pad(parts.hours)}</span>
                <span className="mt-0.5 text-[10px] text-slate-400">hrs</span>
            </span>
            <span className="text-slate-500">:</span>
            <span className="inline-flex min-w-[2.25rem] flex-col items-center rounded-lg bg-white/[0.06] px-1.5 py-1">
                <span className="text-sm leading-none font-bold text-white">{pad(parts.minutes)}</span>
                <span className="mt-0.5 text-[10px] text-slate-400">min</span>
            </span>
            <span className="text-slate-500">:</span>
            <span className="inline-flex min-w-[2.25rem] flex-col items-center rounded-lg bg-white/[0.06] px-1.5 py-1">
                <span className="text-sm leading-none font-bold text-white">{pad(parts.seconds)}</span>
                <span className="mt-0.5 text-[10px] text-slate-400">sec</span>
            </span>
        </div>
    );
}
