import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatMoneyShort } from '../../helpers/money';
import { usePage } from '@inertiajs/react';

export default function CategoryBarChart({ data }) {
    const { currency } = usePage().props;

    return (
        <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis
                    type="category"
                    dataKey="name"
                    width={110}
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                />
                <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                    contentStyle={{
                        background: '#131c31',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 12,
                        color: '#e2e8f0',
                    }}
                    labelStyle={{ color: '#94a3b8', fontWeight: 600 }}
                    formatter={(value) => [formatMoneyShort(value, currency), 'Spent']}
                />
                <Bar dataKey="total" name="Spent" radius={[0, 8, 8, 0]} barSize={18}>
                    {data.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}
