<?php

namespace App\Observers;

use App\Models\User;

class UserObserver
{
    public const DEFAULT_EXPENSE_CATEGORIES = [
        ['name' => 'House Rent', 'icon' => 'home', 'color' => '#8b5cf6', 'budget_limit' => 1200],
        ['name' => 'Mortgage', 'icon' => 'landmark', 'color' => '#6366f1', 'budget_limit' => null],
        ['name' => 'Electricity', 'icon' => 'zap', 'color' => '#f59e0b', 'budget_limit' => 150],
        ['name' => 'Gas', 'icon' => 'flame', 'color' => '#f97316', 'budget_limit' => 80],
        ['name' => 'Water', 'icon' => 'droplets', 'color' => '#0ea5e9', 'budget_limit' => 40],
        ['name' => 'Mobile Subscription', 'icon' => 'smartphone', 'color' => '#10b981', 'budget_limit' => 50],
        ['name' => 'Internet', 'icon' => 'wifi', 'color' => '#06b6d4', 'budget_limit' => 60],
        ['name' => 'Insurance', 'icon' => 'shield-check', 'color' => '#f43f5e', 'budget_limit' => null],
        ['name' => 'Parent Funding', 'icon' => 'heart-handshake', 'color' => '#ec4899', 'budget_limit' => 300],
        ['name' => 'Groceries', 'icon' => 'shopping-basket', 'color' => '#22c55e', 'budget_limit' => 600],
        ['name' => 'Household Supplies', 'icon' => 'shopping-cart', 'color' => '#84cc16', 'budget_limit' => 120],
        ['name' => 'Transport', 'icon' => 'car', 'color' => '#eab308', 'budget_limit' => 200],
        ['name' => 'Savings', 'icon' => 'piggy-bank', 'color' => '#14b8a6', 'budget_limit' => 400],
        ['name' => 'Entertainment', 'icon' => 'tv', 'color' => '#a855f7', 'budget_limit' => 100],
        ['name' => 'Other Expenses', 'icon' => 'tag', 'color' => '#64748b', 'budget_limit' => null],
    ];

    public const DEFAULT_INCOME_CATEGORIES = [
        ['name' => 'Salary', 'icon' => 'wallet', 'color' => '#10b981', 'budget_limit' => null],
        ['name' => 'Freelance', 'icon' => 'briefcase', 'color' => '#0ea5e9', 'budget_limit' => null],
        ['name' => 'Business', 'icon' => 'store', 'color' => '#f59e0b', 'budget_limit' => null],
        ['name' => 'Investments', 'icon' => 'trending-up', 'color' => '#8b5cf6', 'budget_limit' => null],
        ['name' => 'Other Income', 'icon' => 'plus-circle', 'color' => '#64748b', 'budget_limit' => null],
    ];

    public function created(User $user): void
    {
        foreach (self::DEFAULT_EXPENSE_CATEGORIES as $category) {
            $user->categories()->create([...$category, 'type' => 'expense']);
        }

        foreach (self::DEFAULT_INCOME_CATEGORIES as $category) {
            $user->categories()->create([...$category, 'type' => 'income']);
        }
    }
}
