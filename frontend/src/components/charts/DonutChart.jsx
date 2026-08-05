import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { formatMoneyShort } from '../../helpers/money';
import { useApp } from '../../context/AppContext';

export default function DonutChart({ data, centerLabel, centerValue }) {
    const { currency } = useApp();

    return (
        <div className="relative h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="total"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
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
                <span className="text-xs font-medium text-slate-400">{centerLabel}</span>
                <span className="mt-1 text-2xl font-bold text-white tabular-nums">{centerValue}</span>
            </div>
        </div>
    );
}
