import { router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import dayjs from 'dayjs';

export default function MonthPicker({ month, route }) {
    const changeMonth = (offset) => {
        const next = dayjs(`${month}-01`).add(offset, 'month').format('YYYY-MM');
        router.get(route, { month: next }, { preserveState: true, replace: true });
    };

    return (
        <div className="flex items-center gap-2">
            <button onClick={() => changeMonth(-1)} className="btn-secondary !px-2.5 !py-2">
                <ChevronLeft size={16} />
            </button>
            <input
                type="month"
                value={month}
                onChange={(e) => {
                    if (e.target.value) {
                        router.get(route, { month: e.target.value }, { preserveState: true, replace: true });
                    }
                }}
                className="input w-auto !py-2 text-center"
            />
            <button onClick={() => changeMonth(1)} className="btn-secondary !px-2.5 !py-2">
                <ChevronRight size={16} />
            </button>
        </div>
    );
}
