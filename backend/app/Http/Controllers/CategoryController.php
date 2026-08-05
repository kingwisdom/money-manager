<?php

namespace App\Http\Controllers;

use App\Http\Requests\CategoryRequest;
use App\Models\Category;
use Carbon\Carbon;
use Illuminate\Http\Request;

class CategoryController extends Controller
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
            ->withCount('bills')
            ->orderBy('type')
            ->orderBy('name')
            ->get()
            ->map(fn (Category $category) => [
                'id' => $category->id,
                'name' => $category->name,
                'type' => $category->type,
                'icon' => $category->icon,
                'color' => $category->color,
                'budget_limit' => (float) $category->budget_limit,
                'bills_count' => $category->bills_count,
                'spent_this_month' => (float) ($spent[$category->id] ?? 0),
            ]);

        return response()->json([
            'categories' => $categories,
        ]);
    }

    public function store(CategoryRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = $request->user()->id;
        $data['budget_limit'] = $data['budget_limit'] ?? null;

        $category = $request->user()->categories()->create($data);

        return response()->json(['message' => 'Category created.', 'category' => $category], 201);
    }

    public function update(CategoryRequest $request, Category $category)
    {
        $this->authorize('update', $category);

        $data = $request->validated();
        $data['budget_limit'] = $data['budget_limit'] ?? null;

        $category->update($data);

        return response()->json(['message' => 'Category updated.', 'category' => $category]);
    }

    public function destroy(Request $request, Category $category)
    {
        $this->authorize('delete', $category);

        $category->delete();

        return response()->json(['message' => 'Category deleted.']);
    }
}
