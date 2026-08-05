import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { formatMoneyShort } from '../../helpers/money';
import { useApp } from '../../context/AppContext';

export default function IncomeExpenseChart({ data }) {
    const { currency } = useApp();

    return (
        <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis
                    dataKey="label"
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                />
                <YAxis
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => formatMoneyShort(v, currency)}
                    width={70}
                />
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
                <Area
                    type="monotone"
                    dataKey="income"
                    name="Income"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fill="url(#incomeFill)"
                    dot={false}
                    activeDot={{ r: 5 }}
                />
                <Area
                    type="monotone"
                    dataKey="expense"
                    name="Expenses"
                    stroke="#f43f5e"
                    strokeWidth={2.5}
                    fill="url(#expenseFill)"
                    dot={false}
                    activeDot={{ r: 5 }}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
