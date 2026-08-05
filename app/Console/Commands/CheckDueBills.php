<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Console\Command;

class CheckDueBills extends Command
{
    protected $signature = 'bills:check-due';

    protected $description = 'Create notifications for bills that are due soon or overdue';

    public function handle(NotificationService $service): int
    {
        $notified = 0;

        User::chunkById(100, function ($users) use ($service, &$notified) {
            foreach ($users as $user) {
                $notified += $service->syncDueBills($user)->count();
            }
        });

        $this->info("Checked due bills. {$notified} new notification(s) created.");

        return self::SUCCESS;
    }
}
