<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\Payment;
use App\Services\NotificationService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class PaymentController extends Controller
{
    public function store(Request $request, NotificationService $notificationService)
    {
        $validated = $request->validate([
            'bill_id' => ['required', 'exists:bills,id'],
            'paid_on' => ['nullable', 'date'],
            'amount' => ['nullable', 'numeric', 'min:0.01'],
        ]);

        $user = $request->user();
        $bill = $user->bills()->findOrFail($validated['bill_id']);
        $paidOn = $validated['paid_on'] ?? Carbon::today();

        $payment = $user->payments()->create([
            'bill_id' => $bill->id,
            'amount' => $validated['amount'] ?? $bill->amount,
            'paid_on' => $paidOn,
        ]);

        $user->expenses()->create([
            'category_id' => $bill->category_id,
            'bill_id' => $bill->id,
            'description' => $bill->name,
            'amount' => $payment->amount,
            'spent_on' => $paidOn,
        ]);

        $notificationService->syncDueBills($user);

        return Redirect::back()->with('flash', ['success' => $bill->name.' marked as paid.']);
    }

    public function destroy(Request $request, Payment $payment)
    {
        abort_unless($request->user()->id === $payment->user_id, 403);

        $request->user()->expenses()
            ->where('bill_id', $payment->bill_id)
            ->whereDate('spent_on', $payment->paid_on->toDateString())
            ->delete();

        $payment->delete();

        return Redirect::back()->with('flash', ['success' => 'Payment undone.']);
    }
}
