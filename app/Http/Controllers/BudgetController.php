<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class BudgetController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $monthStart = Carbon::now()->startOfMonth();
        $monthEnd = Carbon::now()->endOfMonth();

        $spent = $user->expenses()
            ->whereBetween('spent_on', [$monthStart->toDateString(), $monthEnd->toDateString()])
            ->selectRaw('category_id, SUM(amount) as total')
            ->groupBy('category_id')
            ->pluck('total', 'category_id');

        $categories = $user->categories()
            ->where('type', 'expense')
            ->orderBy('name')
            ->get()
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
            ->sortBy(fn ($item) => $item['limit'] === 0.0 ? 1 : 0)
            ->sortByDesc('percent')
            ->values();

        return Inertia::render('Budgets', [
            'budgets' => $categories,
            'month' => $monthStart->format('F Y'),
        ]);
    }

    public function update(Request $request, Category $category)
    {
        $this->authorize('update', $category);

        $validated = $request->validate([
            'budget_limit' => ['nullable', 'numeric', 'min:0', 'max:9999999999'],
        ]);

        $category->update([
            'budget_limit' => $validated['budget_limit'] ?: null,
        ]);

        return Redirect::back()->with('flash', ['success' => 'Budget updated.']);
    }
}
