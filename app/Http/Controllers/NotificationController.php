<?php

namespace App\Http\Controllers;

use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $notifications = $request->user()->appNotifications()
            ->latest()
            ->limit(100)
            ->get()
            ->map(fn ($notification) => $notification->toArray());

        return Inertia::render('Notifications', [
            'notifications' => $notifications,
        ]);
    }

    public function poll(Request $request, NotificationService $service)
    {
        $new = $service->syncDueBills($request->user());

        $unread = $service->unreadCount($request->user());

        $recent = $request->user()->appNotifications()
            ->latest()
            ->limit(6)
            ->get()
            ->map(fn ($n) => $n->toArray());

        return response()->json([
            'unread' => $unread,
            'new' => $new->map(fn ($n) => $n->toArray())->values(),
            'recent' => $recent,
        ]);
    }

    public function readAll(Request $request)
    {
        $request->user()->appNotifications()->unread()->update(['read_at' => now()]);

        return Redirect::back();
    }

    public function read(Request $request, int $notification)
    {
        $item = $request->user()->appNotifications()->findOrFail($notification);
        $item->update(['read_at' => now()]);

        return Redirect::back();
    }
}
