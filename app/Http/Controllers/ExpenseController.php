<?php

namespace App\Http\Controllers;

use App\Http\Requests\ExpenseRequest;
use App\Models\Expense;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class ExpenseController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $month = $request->query('month', Carbon::now()->format('Y-m'));
        $category = $request->query('category');

        [$start, $end] = $this->monthRange($month);

        $query = $user->expenses()
            ->with('category:id,name,color,icon')
            ->whereBetween('spent_on', [$start, $end]);

        if ($category && $category !== 'all') {
            $query->where('category_id', $category);
        }

        $expenses = $query->latest('spent_on')->get();
        $total = (float) $expenses->sum('amount');

        return Inertia::render('Expenses', [
            'expenses' => $expenses,
            'month' => $month,
            'total' => $total,
            'filter' => $category ?? 'all',
        ]);
    }

    public function store(ExpenseRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = $request->user()->id;

        $request->user()->expenses()->create($data);

        return Redirect::back()->with('flash', ['success' => 'Expense recorded.']);
    }

    public function update(ExpenseRequest $request, Expense $expense)
    {
        $this->authorize('update', $expense);

        $expense->update($request->validated());

        return Redirect::back()->with('flash', ['success' => 'Expense updated.']);
    }

    public function destroy(Request $request, Expense $expense)
    {
        $this->authorize('delete', $expense);

        $expense->delete();

        return Redirect::back()->with('flash', ['success' => 'Expense deleted.']);
    }

    private function monthRange(string $month): array
    {
        $date = Carbon::createFromFormat('Y-m', $month);

        return [$date->copy()->startOfMonth()->toDateString(), $date->copy()->endOfMonth()->toDateString()];
    }
}
