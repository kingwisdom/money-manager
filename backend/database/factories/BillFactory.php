<?php

namespace Database\Factories;

use App\Models\Bill;
use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Bill>
 */
class BillFactory extends Factory
{
    protected $model = Bill::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'category_id' => null,
            'name' => fake()->unique()->words(2, true),
            'amount' => fake()->randomFloat(2, 10, 2000),
            'due_day' => fake()->numberBetween(1, 28),
            'due_month' => null,
            'frequency' => 'monthly',
            'auto_pay' => false,
            'active' => true,
            'reminder_days' => 3,
            'notes' => null,
        ];
    }

    public function forUser(User $user): static
    {
        return $this->state(fn () => [
            'user_id' => $user->id,
            'category_id' => Category::factory()->create(['user_id' => $user->id])->id,
        ]);
    }
}
