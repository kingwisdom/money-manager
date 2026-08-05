<?php

namespace App\Services;

use App\Models\User;
use App\Models\UserNotification;
use Carbon\Carbon;

class NotificationService
{
    /**
     * Create (deduplicated) notifications for bills that are due soon or overdue.
     *
     * @return \Illuminate\Support\Collection<int, UserNotification>
     */
    public function syncDueBills(User $user): \Illuminate\Support\Collection
    {
        $bills = $user->bills()->where('active', true)->with('category')->get();
        $service = app(BillService::class);

        $created = collect();

        foreach ($bills as $bill) {
            $nextDue = $service->nextDueDate($bill);
            $days = (int) Carbon::today()->startOfDay()->diffInDays($nextDue, false);

            if ($days > $bill->reminder_days) {
                continue;
            }

            $periodKey = $service->periodKey($bill);

            $alreadyNotified = $user->appNotifications()
                ->where('type', 'bill_due')
                ->where('meta->period_key', $periodKey)
                ->exists();

            if ($alreadyNotified) {
                continue;
            }

            $created->push(UserNotification::create([
                'user_id' => $user->id,
                'title' => $this->title($bill->name, $days),
                'body' => $this->body($bill->name, $nextDue, $bill->amount, $days),
                'type' => 'bill_due',
                'url' => '/bills',
                'meta' => ['period_key' => $periodKey, 'bill_id' => $bill->id],
            ]));
        }

        return $created;
    }

    public function unreadCount(User $user): int
    {
        return $user->appNotifications()->unread()->count();
    }

    private function title(string $billName, int $days): string
    {
        if ($days < 0) {
            return $billName.' is overdue';
        }

        if ($days === 0) {
            return $billName.' is due today';
        }

        return $billName.' is due soon';
    }

    private function body(string $billName, Carbon $nextDue, string $amount, int $days): string
    {
        $due = $nextDue->format('M j, Y');

        if ($days < 0) {
            $offset = abs($days);

            return $billName.' ('.$amount.') was due '.$due.' — '.$offset.' day'.($offset === 1 ? '' : 's').' ago.';
        }

        if ($days === 0) {
            return $billName.' ('.$amount.') is due today ('.$due.').';
        }

        return $billName.' ('.$amount.') is due on '.$due.' — '.$days.' day'.($days === 1 ? '' : 's').' left.';
    }
}
