<?php

namespace App\Http\Controllers;

use App\Models\Bill;
use App\Models\Category;
use App\Models\Expense;
use App\Models\Income;
use App\Services\BillService;
use App\Services\NotificationService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke(Request $request, BillService $billService, NotificationService $notificationService)
    {
        $user = $request->user();
        $now = Carbon::now();
        $monthStart = $now->copy()->startOfMonth();
        $monthEnd = $now->copy()->endOfMonth();

        $notificationService->syncDueBills($user);

        $monthIncome = (float) $user->incomes()
            ->whereBetween('received_on', [$monthStart->toDateString(), $monthEnd->toDateString()])
            ->sum('amount');

        $monthExpense = (float) $user->expenses()
            ->whereBetween('spent_on', [$monthStart->toDateString(), $monthEnd->toDateString()])
            ->sum('amount');

        $bills = $user->bills()->where('active', true)->with('category')->get();
        $upcomingBills = $billService->attachStatus($bills);

        $monthlyBillsTotal = collect($upcomingBills)
            ->filter(fn ($bill) => str_starts_with($bill['due']['next_due'], $now->format('Y-m')))
            ->sum(fn ($bill) => (float) $bill['amount']);

        $dueCounts = [
            'overdue' => collect($upcomingBills)->where('due.key', 'overdue')->count(),
            'due_today' => collect($upcomingBills)->whereIn('due.key', ['due_today', 'due_tomorrow'])->count(),
            'due_soon' => collect($upcomingBills)->whereIn('due.key', ['due_soon', 'due_today', 'due_tomorrow', 'overdue'])->count(),
        ];

        return Inertia::render('Dashboard', [
            'month' => [
                'label' => $now->format('F Y'),
                'income' => $monthIncome,
                'expense' => $monthExpense,
                'surplus' => $monthIncome - $monthExpense,
                'bills_total' => $monthlyBillsTotal,
                'bills_paid' => (float) $user->expenses()
                    ->whereNotNull('bill_id')
                    ->whereBetween('spent_on', [$monthStart->toDateString(), $monthEnd->toDateString()])
                    ->sum('amount'),
            ],
            'upcomingBills' => array_slice($upcomingBills, 0, 8),
            'dueCounts' => $dueCounts,
            'incomeVsExpense' => $this->incomeVsExpense($user, $now),
            'expenseByCategory' => $this->expenseByCategory($user, $monthStart, $monthEnd),
            'budgets' => $this->budgets($user, $monthStart, $monthEnd),
            'recentTransactions' => $this->recentTransactions($user),
        ]);
    }

    private function incomeVsExpense($user, Carbon $now): array
    {
        $months = collect(range(5, 0))->map(function ($i) use ($user, $now) {
            $start = $now->copy()->startOfMonth()->subMonthsNoOverflow($i);
            $end = $start->copy()->endOfMonth();

            return [
                'label' => $start->format('M'),
                'income' => (float) $user->incomes()->whereBetween('received_on', [$start->toDateString(), $end->toDateString()])->sum('amount'),
                'expense' => (float) $user->expenses()->whereBetween('spent_on', [$start->toDateString(), $end->toDateString()])->sum('amount'),
            ];
        });

        return $months->all();
    }

    private function expenseByCategory($user, Carbon $monthStart, Carbon $monthEnd): array
    {
        $rows = $user->expenses()
            ->whereBetween('spent_on', [$monthStart->toDateString(), $monthEnd->toDateString()])
            ->with('category:id,name,color,icon')
            ->selectRaw('category_id, SUM(amount) as total')
            ->groupBy('category_id')
            ->get();

        return $rows
            ->filter(fn ($row) => $row->category !== null)
            ->map(fn ($row) => [
                'name' => $row->category->name,
                'color' => $row->category->color,
                'icon' => $row->category->icon,
                'total' => (float) $row->total,
            ])
            ->sortByDesc('total')
            ->values()
            ->all();
    }

    private function budgets($user, Carbon $monthStart, Carbon $monthEnd): array
    {
        $categories = $user->categories()
            ->where('type', 'expense')
            ->whereNotNull('budget_limit')
            ->get(['id', 'name', 'color', 'icon', 'budget_limit']);

        $spent = $user->expenses()
            ->whereBetween('spent_on', [$monthStart->toDateString(), $monthEnd->toDateString()])
            ->selectRaw('category_id, SUM(amount) as total')
            ->groupBy('category_id')
            ->pluck('total', 'category_id');

        return $categories
            ->map(function (Category $category) use ($spent) {
                $limit = (float) $category->budget_limit;
                $total = (float) ($spent[$category->id] ?? 0);

                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'color' => $category->color,
                    'icon' => $category->icon,
                    'limit' => $limit,
                    'spent' => $total,
                    'remaining' => $limit - $total,
                    'percent' => $limit > 0 ? round($total / $limit * 100) : 0,
                ];
            })
            ->sortByDesc('percent')
            ->values()
            ->all();
    }

    private function recentTransactions($user): array
    {
        $expenses = $user->expenses()
            ->latest('spent_on')
            ->with('category:id,name,color,icon')
            ->take(6)
            ->get()
            ->map(fn (Expense $e) => [
                'id' => 'e'.$e->id,
                'type' => 'expense',
                'label' => $e->description,
                'amount' => (float) $e->amount,
                'date' => $e->spent_on->toDateString(),
                'category' => $e->category?->name,
                'color' => $e->category?->color ?? '#64748b',
                'icon' => $e->category?->icon ?? 'tag',
            ]);

        $incomes = $user->incomes()
            ->latest('received_on')
            ->with('category:id,name,color,icon')
            ->take(6)
            ->get()
            ->map(fn (Income $i) => [
                'id' => 'i'.$i->id,
                'type' => 'income',
                'label' => $i->source,
                'amount' => (float) $i->amount,
                'date' => $i->received_on->toDateString(),
                'category' => $i->category?->name,
                'color' => $i->category?->color ?? '#22c55e',
                'icon' => $i->category?->icon ?? 'wallet',
            ]);

        return $expenses->concat($incomes)
            ->sortByDesc('date')
            ->take(8)
            ->values()
            ->all();
    }
}
