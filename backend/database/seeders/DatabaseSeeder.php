<?php

namespace Database\Seeders;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::factory()->create([
            'name' => 'Demo User',
            'email' => 'demo@money.com',
            'password' => Hash::make('password'),
            'currency' => '$',
        ]);

        $now = Carbon::today();

        $salary = $user->categories()->where('name', 'Salary')->first();
        $freelance = $user->categories()->where('name', 'Freelance')->first();

        // Six months of monthly salary + freelance income for the chart.
        foreach (range(5, 0) as $i) {
            $monthStart = $now->copy()->startOfMonth()->subMonthsNoOverflow($i);

            $user->incomes()->create([
                'category_id' => $salary->id,
                'source' => 'Monthly salary',
                'amount' => 4500,
                'received_on' => $monthStart->copy()->day(1),
            ]);

            if ($i % 2 === 0) {
                $user->incomes()->create([
                    'category_id' => $freelance->id,
                    'source' => 'Freelance project',
                    'amount' => 850,
                    'received_on' => $monthStart->copy()->day(15),
                ]);
            }
        }

        $bills = [
            ['name' => 'House Rent', 'category' => 'House Rent', 'amount' => 1200, 'due_day' => 1, 'reminder_days' => 3],
            ['name' => 'Electricity', 'category' => 'Electricity', 'amount' => 85.40, 'due_day' => 15, 'reminder_days' => 2],
            ['name' => 'Mobile Subscription', 'category' => 'Mobile Subscription', 'amount' => 49.99, 'due_day' => 5, 'reminder_days' => 1],
            ['name' => 'Home Internet', 'category' => 'Internet', 'amount' => 64.99, 'due_day' => 7, 'reminder_days' => 3],
            ['name' => 'Gas Supply', 'category' => 'Gas', 'amount' => 45, 'due_day' => 18, 'reminder_days' => 3],
            ['name' => 'Parent Funding', 'category' => 'Parent Funding', 'amount' => 300, 'due_day' => 25, 'reminder_days' => 5],
            ['name' => 'Annual Insurance', 'category' => 'Insurance', 'amount' => 1250, 'due_day' => 20, 'due_month' => 3, 'frequency' => 'yearly', 'reminder_days' => 7],
            ['name' => 'Mortgage Payment', 'category' => 'Mortgage', 'amount' => 1850, 'due_day' => 28, 'reminder_days' => 5],
        ];

        $createdBills = [];

        foreach ($bills as $bill) {
            $category = $user->categories()->where('name', $bill['category'])->first();

            $created = $user->bills()->create([
                'category_id' => $category?->id,
                'name' => $bill['name'],
                'amount' => $bill['amount'],
                'due_day' => $bill['due_day'],
                'due_month' => $bill['due_month'] ?? null,
                'frequency' => $bill['frequency'] ?? 'monthly',
                'auto_pay' => in_array($bill['name'], ['Mobile Subscription', 'Home Internet']),
                'active' => true,
                'reminder_days' => $bill['reminder_days'],
                'notes' => null,
            ]);

            $createdBills[$bill['name']] = $created;
        }

        // Pay a few bills for the current month so their countdown has already advanced.
        $paidNow = ['House Rent', 'Mobile Subscription', 'Home Internet'];
        foreach ($paidNow as $name) {
            $bill = $createdBills[$name];
            $due = $bill->nextDueDate();

            if ($due->lt($now)) {
                $user->payments()->create([
                    'bill_id' => $bill->id,
                    'amount' => $bill->amount,
                    'paid_on' => $due->toDateString(),
                ]);

                $user->expenses()->create([
                    'category_id' => $bill->category_id,
                    'bill_id' => $bill->id,
                    'description' => $bill->name,
                    'amount' => $bill->amount,
                    'spent_on' => $due->toDateString(),
                ]);
            }
        }

        // History expenses across six months.
        $historyCats = $user->categories()->where('type', 'expense')->get();
        foreach (range(5, 0) as $i) {
            $month = $now->copy()->startOfMonth()->subMonthsNoOverflow($i);

            $user->expenses()->create([
                'category_id' => $historyCats->where('name', 'Groceries')->first()->id,
                'description' => 'Groceries',
                'amount' => 420 + $i * 15,
                'spent_on' => $month->copy()->day(8),
            ]);

            $user->expenses()->create([
                'category_id' => $historyCats->where('name', 'Transport')->first()->id,
                'description' => 'Fuel & transit',
                'amount' => 180 + $i * 10,
                'spent_on' => $month->copy()->day(12),
            ]);

            $user->expenses()->create([
                'category_id' => $historyCats->where('name', 'Electricity')->first()->id,
                'description' => 'Electricity',
                'amount' => 85,
                'spent_on' => $month->copy()->day(15),
            ]);

            $user->expenses()->create([
                'category_id' => $historyCats->where('name', 'Household Supplies')->first()->id,
                'description' => 'Household items',
                'amount' => 95,
                'spent_on' => $month->copy()->day(20),
            ]);
        }

        // A couple of extra one-off expenses in the current month to animate budgets.
        $user->expenses()->create([
            'category_id' => $historyCats->where('name', 'Entertainment')->first()->id,
            'description' => 'Streaming & movie night',
            'amount' => 42,
            'spent_on' => $now->copy()->subDays(4)->toDateString(),
        ]);

        $user->expenses()->create([
            'category_id' => $historyCats->where('name', 'Groceries')->first()->id,
            'description' => 'Weekly groceries',
            'amount' => 158,
            'spent_on' => $now->copy()->subDays(2)->toDateString(),
        ]);
    }
}
