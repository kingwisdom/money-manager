const formatters = new Map<string, Intl.NumberFormat>();

function getFormatter(currency: string): Intl.NumberFormat {
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
  return formatters.get(currency)!;
}

export function formatMoney(amount: number | string | null | undefined, currency = '$'): string {
  const value = Number(amount ?? 0);
  if (Number.isNaN(value)) return `${currency}0.00`;
  try {
    return getFormatter(currency).format(value);
  } catch {
    return `${currency}${value.toFixed(2)}`;
  }
}

export function formatMoneyShort(amount: number | string | null | undefined, currency = '$'): string {
  const value = Number(amount ?? 0);
  const abs = Math.abs(value);
  if (abs >= 1000000) return `${currency}${(value / 1000000).toFixed(1)}M`;
  if (abs >= 1000) return `${currency}${(value / 1000).toFixed(1)}k`;
  return `${currency}${value.toFixed(0)}`;
}