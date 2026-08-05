<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
class CategoryFactory extends Factory
{
    protected $model = Category::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'name' => fake()->unique()->words(2, true),
            'type' => 'expense',
            'icon' => 'tag',
            'color' => fake()->hexColor(),
            'budget_limit' => null,
        ];
    }

    public function income(): static
    {
        return $this->state(fn () => ['type' => 'income']);
    }
}
