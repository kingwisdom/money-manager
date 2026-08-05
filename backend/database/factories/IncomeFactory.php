<?php

namespace Database\Factories;

use App\Models\Income;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Income>
 */
class IncomeFactory extends Factory
{
    protected $model = Income::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'category_id' => null,
            'source' => fake()->randomElement(['Salary', 'Freelance', 'Business', 'Investment', 'Other']),
            'amount' => fake()->randomFloat(2, 200, 10000),
            'received_on' => fake()->date(),
        ];
    }
}
