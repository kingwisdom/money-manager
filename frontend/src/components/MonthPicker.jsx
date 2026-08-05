import { ChevronLeft, ChevronRight } from 'lucide-react';
import dayjs from 'dayjs';

export default function MonthPicker({ month, onChange }) {
    const changeMonth = (offset) => {
        const next = dayjs(`${month}-01`).add(offset, 'month').format('YYYY-MM');
        onChange(next);
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
                        onChange(e.target.value);
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
