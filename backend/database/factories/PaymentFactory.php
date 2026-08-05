<?php

namespace Database\Factories;

use App\Models\Bill;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Payment>
 */
class PaymentFactory extends Factory
{
    protected $model = Payment::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'bill_id' => Bill::factory(),
            'amount' => fake()->randomFloat(2, 10, 2000),
            'paid_on' => fake()->date(),
        ];
    }
}
