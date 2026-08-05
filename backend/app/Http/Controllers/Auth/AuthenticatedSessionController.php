<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): JsonResponse
    {
        $request->authenticate();

        $token = $request->user()->createToken('app')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $this->userPayload($request),
        ]);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out.']);
    }

    private function userPayload(Request $request): array
    {
        return array_merge($request->user()->only(['id', 'name', 'email', 'currency', 'email_verified_at']), [
            'initials' => Str::upper(collect(explode(' ', $request->user()->name))->map(fn ($part) => mb_substr($part, 0, 1))->implode('')),
        ]);
    }
}
