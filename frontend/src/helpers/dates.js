import dayjs from 'dayjs';

export function formatDate(date, format = 'MMM D, YYYY') {
    return dayjs(date).format(format);
}

export function relativeDay(date) {
    const target = dayjs(date).startOf('day');
    const today = dayjs().startOf('day');

    const diff = target.diff(today, 'day');

    if (diff === 0) return 'Today';
    if (diff === 1) return 'Tomorrow';
    if (diff === -1) return 'Yesterday';

    return formatDate(date);
}

export function dueLabel(days) {
    if (days < 0) return `${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'} overdue`;
    if (days === 0) return 'Due today';
    if (days === 1) return 'Due tomorrow';
    return `${days} days left`;
}

export function monthInputValue(date = dayjs()) {
    return dayjs(date).format('YYYY-MM');
}
