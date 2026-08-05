<?php

namespace App\Http\Controllers;

use App\Http\Requests\ExpenseRequest;
use App\Models\Expense;
use Carbon\Carbon;
use Illuminate\Http\Request;

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

        return response()->json([
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

        $expense = $request->user()->expenses()->create($data);

        return response()->json(['message' => 'Expense recorded.', 'expense' => $expense], 201);
    }

    public function update(ExpenseRequest $request, Expense $expense)
    {
        $this->authorize('update', $expense);

        $expense->update($request->validated());

        return response()->json(['message' => 'Expense updated.', 'expense' => $expense]);
    }

    public function destroy(Request $request, Expense $expense)
    {
        $this->authorize('delete', $expense);

        $expense->delete();

        return response()->json(['message' => 'Expense deleted.']);
    }

    private function monthRange(string $month): array
    {
        $date = Carbon::createFromFormat('Y-m', $month);

        return [$date->copy()->startOfMonth()->toDateString(), $date->copy()->endOfMonth()->toDateString()];
    }
}
