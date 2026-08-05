<?php

namespace App\Services;

use App\Models\Bill;
use Carbon\Carbon;

class BillService
{
    public function nextDueDate(Bill $bill, ?Carbon $from = null): Carbon
    {
        $from = $from ?? Carbon::today();
        $lastPaid = $bill->lastPaidOn();

        if ($bill->frequency === 'yearly') {
            return $this->nextYearlyDue($bill, $from, $lastPaid);
        }

        return $this->nextMonthlyDue($bill->due_day, $from, $lastPaid);
    }

    public function daysUntil(Bill $bill, ?Carbon $from = null): int
    {
        $from = $from ?? Carbon::today();

        return (int) $from->copy()->startOfDay()->diffInDays($this->nextDueDate($bill, $from), false);
    }

    public function status(Bill $bill, ?Carbon $from = null): array
    {
        $days = $this->daysUntil($bill, $from);
        $due = $this->nextDueDate($bill, $from);

        if ($days < 0) {
            $key = 'overdue';
            $label = 'Overdue';
        } elseif ($days === 0) {
            $key = 'due_today';
            $label = 'Due today';
        } elseif ($days === 1) {
            $key = 'due_tomorrow';
            $label = 'Due tomorrow';
        } elseif ($days <= $bill->reminder_days) {
            $key = 'due_soon';
            $label = 'Due in '.$days.' days';
        } else {
            $key = 'upcoming';
            $label = 'Due in '.$days.' days';
        }

        return [
            'key' => $key,
            'label' => $label,
            'days' => $days,
            'next_due' => $due->toDateString(),
            'next_due_display' => $due->format('M j, Y'),
        ];
    }

    public function periodKey(Bill $bill, ?Carbon $from = null): string
    {
        return 'bill:'.$bill->id.':'.$this->nextDueDate($bill, $from)->format('Y-m');
    }

    public function attachStatus(iterable $bills, ?Carbon $from = null): array
    {
        $from = $from ?? Carbon::today();

        $items = collect($bills)
            ->map(fn (Bill $bill) => $bill->toArray() + ['due' => $this->status($bill, $from)])
            ->sortBy(fn ($item) => $item['due']['days'])
            ->values()
            ->all();

        return $items;
    }

    private function nextMonthlyDue(int $dueDay, Carbon $from, ?Carbon $lastPaid): Carbon
    {
        $candidate = $from->copy()->startOfMonth()->day(min($dueDay, $from->daysInMonth))->startOfDay();

        if ($lastPaid && $lastPaid->isSameMonth($candidate)) {
            $next = $from->copy()->addMonthNoOverflow();

            return $next->copy()->startOfMonth()->day(min($dueDay, $next->daysInMonth))->startOfDay();
        }

        return $candidate;
    }

    private function nextYearlyDue(Bill $bill, Carbon $from, ?Carbon $lastPaid): Carbon
    {
        $month = $bill->due_month ?: $from->month;
        $daysInMonth = Carbon::create($from->year, $month)->daysInMonth;
        $candidate = Carbon::create($from->year, $month, min($bill->due_day, $daysInMonth))->startOfDay();

        if ($lastPaid && $lastPaid->year === $candidate->year) {
            $daysInMonth = Carbon::create($from->year + 1, $month)->daysInMonth;

            return Carbon::create($from->year + 1, $month, min($bill->due_day, $daysInMonth))->startOfDay();
        }

        return $candidate;
    }
}
