import { useState, useMemo } from "react";

const DEFAULT_PERCENTAGES = {
    giving: 5,
    saving: 10,
    expenses: 75,
    investment: 10,
    others: 0,
};

export default function IncomeManager() {
    const [income, setIncome] = useState("");
    const [percentages, setPercentages] = useState(DEFAULT_PERCENTAGES);

    const totalPercentage = useMemo(() => {
        return Object.values(percentages).reduce((a, b) => a + Number(b), 0);
    }, [percentages]);

    const calculatedAmounts = useMemo(() => {
        if (!income) return {};
        const total = Number(income);

        return Object.entries(percentages).reduce((acc, [key, value]) => {
            acc[key] = ((total * value) / 100).toFixed(2);
            return acc;
        }, {});
    }, [income, percentages]);

    const handlePercentageChange = (key, value) => {
        setPercentages(prev => ({
            ...prev,
            [key]: Number(value),
        }));
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 space-y-6">

                {/* Header */}
                <div className="text-center">
                    <h1 className="text-2xl font-bold">
                        INCOME <span className="text-orange-500">MANAGER</span>
                    </h1>
                    <p className="text-sm text-gray-500 mt-2">
                        Calculate your income allocation
                    </p>
                </div>

                {/* Income Input */}
                <div>
                    <label className="text-sm font-semibold">Total Income</label>
                    <input
                        type="number"
                        value={income}
                        onChange={e => setIncome(e.target.value)}
                        placeholder="Enter your income"
                        className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                </div>

                {/* Percentage Inputs */}
                {Object.entries(percentages).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between gap-4">
                        <label className="capitalize font-medium w-24">{key}</label>

                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={value}
                                onChange={e => handlePercentageChange(key, e.target.value)}
                                className="w-20 px-3 py-1 border rounded-lg focus:ring-orange-400 focus:outline-none"
                            />
                            <span className="text-sm">%</span>
                        </div>

                        <div className="text-lg font-bold w-20 text-right">
                            {calculatedAmounts[key] || 0}
                        </div>
                    </div>
                ))}

                {/* Validation */}
                <div className="text-sm text-center">
                    {totalPercentage !== 100 ? (
                        <p className="text-red-500">
                            Total percentage must equal 100% (Currently {totalPercentage}%)
                        </p>
                    ) : (
                        <p className="text-green-600">Percentages look good ✔</p>
                    )}
                </div>

            </div>
        </div>
    );
}
