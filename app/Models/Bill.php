<?php

namespace App\Models;

use App\Services\BillService;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Bill extends Model
{
    /** @use HasFactory<\Database\Factories\BillFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'category_id',
        'name',
        'amount',
        'due_day',
        'due_month',
        'frequency',
        'auto_pay',
        'active',
        'reminder_days',
        'notes',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'due_day' => 'integer',
        'auto_pay' => 'boolean',
        'active' => 'boolean',
        'reminder_days' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function expenses(): HasMany
    {
        return $this->hasMany(Expense::class);
    }

    public function nextDueDate(?Carbon $from = null): Carbon
    {
        return app(BillService::class)->nextDueDate($this, $from);
    }

    public function lastPaidOn(): ?Carbon
    {
        $last = $this->payments()->latest('paid_on')->first();

        return $last?->paid_on;
    }
}
