<?php

namespace App\Http\Controllers;

use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BootstrapController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'user' => array_merge($user->only(['id', 'name', 'email', 'currency', 'email_verified_at']), [
                'initials' => Str::upper(collect(explode(' ', $user->name))->map(fn ($part) => mb_substr($part, 0, 1))->implode('')),
            ]),
            'currency' => $user->currency ?? config('currency.default'),
            'categories' => $user->categories()
                ->orderBy('name')
                ->get()
                ->map(fn ($category) => [
                    'id' => $category->id,
                    'name' => $category->name,
                    'type' => $category->type,
                    'icon' => $category->icon,
                    'color' => $category->color,
                    'budget_limit' => (float) $category->budget_limit,
                ]),
            'unreadNotifications' => app(NotificationService::class)->unreadCount($user),
        ]);
    }
}
