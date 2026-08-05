const formatters = new Map();

function getFormatter(currency) {
    if (!formatters.has(currency)) {
        formatters.set(
            currency,
            new Intl.NumberFormat(undefined, {
                style: 'currency',
                currency,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }),
        );
    }

    return formatters.get(currency);
}

export function formatMoney(amount, currency = '$') {
    const value = Number(amount ?? 0);

    if (Number.isNaN(value)) {
        return '—';
    }

    try {
        return getFormatter(currency).format(value);
    } catch {
        return `${currency}${value.toFixed(2)}`;
    }
}

export function formatMoneyShort(amount, currency = '$') {
    const value = Number(amount ?? 0);
    const abs = Math.abs(value);

    if (abs >= 1_000_000) {
        return `${currency}${(value / 1_000_000).toFixed(1)}M`;
    }

    if (abs >= 1_000) {
        return `${currency}${(value / 1_000).toFixed(1)}k`;
    }

    return `${currency}${value.toFixed(0)}`;
}
