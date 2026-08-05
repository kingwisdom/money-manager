<?php

namespace Database\Factories;

use App\Models\Expense;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Expense>
 */
class ExpenseFactory extends Factory
{
    protected $model = Expense::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'category_id' => null,
            'bill_id' => null,
            'description' => fake()->sentence(3),
            'amount' => fake()->randomFloat(2, 5, 500),
            'spent_on' => fake()->date(),
        ];
    }
}
