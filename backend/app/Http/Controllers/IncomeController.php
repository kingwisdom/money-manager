<?php

namespace App\Http\Controllers;

use App\Http\Requests\IncomeRequest;
use App\Models\Income;
use Carbon\Carbon;
use Illuminate\Http\Request;

class IncomeController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $month = $request->query('month', Carbon::now()->format('Y-m'));

        [$start, $end] = $this->monthRange($month);

        $incomes = $user->incomes()
            ->with('category:id,name,color,icon')
            ->whereBetween('received_on', [$start, $end])
            ->latest('received_on')
            ->get();

        $total = (float) $incomes->sum('amount');

        return response()->json([
            'incomes' => $incomes,
            'month' => $month,
            'total' => $total,
        ]);
    }

    public function store(IncomeRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = $request->user()->id;

        $income = $request->user()->incomes()->create($data);

        return response()->json(['message' => 'Income recorded.', 'income' => $income], 201);
    }

    public function update(IncomeRequest $request, Income $income)
    {
        $this->authorize('update', $income);

        $income->update($request->validated());

        return response()->json(['message' => 'Income updated.', 'income' => $income]);
    }

    public function destroy(Request $request, Income $income)
    {
        $this->authorize('delete', $income);

        $income->delete();

        return response()->json(['message' => 'Income deleted.']);
    }

    private function monthRange(string $month): array
    {
        $date = Carbon::createFromFormat('Y-m', $month);

        return [$date->copy()->startOfMonth()->toDateString(), $date->copy()->endOfMonth()->toDateString()];
    }
}
