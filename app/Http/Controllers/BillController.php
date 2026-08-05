<?php

namespace App\Http\Controllers;

use App\Http\Requests\BillRequest;
use App\Models\Bill;
use App\Services\BillService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class BillController extends Controller
{
    public function index(Request $request, BillService $billService)
    {
        $user = $request->user();

        $bills = $user->bills()
            ->with(['category:id,name,color,icon', 'payments'])
            ->orderBy('active', 'desc')
            ->orderBy('name')
            ->get();

        $lastPaid = $bills->mapWithKeys(fn (Bill $bill) => [
            $bill->id => [
                'last_paid' => $bill->payments->max('paid_on')?->toDateString(),
                'last_payment_id' => $bill->payments->sortByDesc('paid_on')->first()?->id,
                'payment_count' => $bill->payments->count(),
            ],
        ]);

        $bills = collect($billService->attachStatus($bills))
            ->map(fn ($bill) => array_merge($bill, $lastPaid[$bill['id']] ?? []))
            ->sortBy(fn ($bill) => $bill['active'] ? 0 : 1)
            ->sortBy(fn ($bill) => $bill['due']['days'])
            ->values();

        return Inertia::render('Bills', [
            'bills' => $bills,
            'bill' => null,
        ]);
    }

    public function store(BillRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = $request->user()->id;
        $data['auto_pay'] = $request->boolean('auto_pay');
        $data['active'] = $request->boolean('active');

        $request->user()->bills()->create($data);

        return Redirect::back()->with('flash', ['success' => 'Bill created.']);
    }

    public function update(BillRequest $request, Bill $bill)
    {
        $this->authorize('update', $bill);

        $data = $request->validated();
        $data['auto_pay'] = $request->boolean('auto_pay');
        $data['active'] = $request->boolean('active');

        $bill->update($data);

        return Redirect::back()->with('flash', ['success' => 'Bill updated.']);
    }

    public function destroy(Request $request, Bill $bill)
    {
        $this->authorize('delete', $bill);

        $bill->delete();

        return Redirect::back()->with('flash', ['success' => 'Bill deleted.']);
    }
}
