<?php

namespace App\Http\Middleware;

use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? array_merge($user->only(['id', 'name', 'email', 'currency']), [
                    'initials' => Str::upper(collect(explode(' ', $user->name))->map(fn ($part) => mb_substr($part, 0, 1))->implode('')),
                ]) : null,
            ],
            'currency' => $user?->currency ?? config('currency.default'),
            'categories' => $user
                ? $user->categories()
                    ->orderBy('name')
                    ->get()
                    ->map(fn ($category) => [
                        'id' => $category->id,
                        'name' => $category->name,
                        'type' => $category->type,
                        'icon' => $category->icon,
                        'color' => $category->color,
                        'budget_limit' => (float) $category->budget_limit,
                    ])
                : [],
            'unreadNotifications' => $user ? app(NotificationService::class)->unreadCount($user) : 0,
            'flash' => $request->session()->get('flash'),
        ];
    }
}
