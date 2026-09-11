import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { formatMoneyShort } from '../../helpers/money';
import { useApp } from '../../context/AppContext';
import CategoryIcon from '../CategoryIcon';

export default function ActivityChart({ data }) {
    const { currency } = useApp();

    const total = data.reduce((sum, item) => sum + Number(item.total), 0);

    return (
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="relative h-[200px] w-full shrink-0 sm:w-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="total"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={56}
                            outerRadius={82}
                            paddingAngle={3}
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={index} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                background: '#131c31',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: 12,
                                color: '#e2e8f0',
                            }}
                            labelStyle={{ color: '#94a3b8', fontWeight: 600 }}
                            formatter={(value, name) => [formatMoneyShort(value, currency), name]}
                        />
                    </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xs font-medium text-slate-400">Activity</span>
                    <span className="mt-0.5 text-lg font-bold text-white tabular-nums">
                        {formatMoneyShort(total, currency)}
                    </span>
                </div>
            </div>

            <div className="min-w-0 flex-1 space-y-2.5">
                {data.map((item) => (
                    <div key={`${item.type}-${item.name}`} className="flex items-center gap-3">
                        <span
                            className="h-2.5 w-2.5 shrink-0 rounded-full"
                            style={{ backgroundColor: item.color }}
                        />
                        <div
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                            style={{ backgroundColor: `${item.color}1a`, color: item.color }}
                        >
                            <CategoryIcon icon={item.icon} size={13} />
                        </div>
                        <span className="min-w-0 flex-1 truncate text-sm text-slate-300">{item.name}</span>
                        <span
                            className={`text-sm font-semibold tabular-nums ${
                                item.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                        >
                            {item.type === 'income' ? '+' : '−'}
                            {formatMoneyShort(item.total, currency)}
                        </span>
                        <span className="w-10 text-right text-xs text-slate-500 tabular-nums">
                            {Math.round((Number(item.total) / total) * 100)}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}