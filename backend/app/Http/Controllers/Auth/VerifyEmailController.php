<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function verify(Request $request): JsonResponse
    {
        $user = User::findOrFail((int) $request->query('id'));

        if (! hash_equals((string) $request->query('hash'), sha1($user->email))) {
            abort(403, 'Invalid verification link.');
        }

        if ($user->email_verified_at) {
            return response()->json(['message' => 'Email already verified.']);
        }

        $user->forceFill(['email_verified_at' => now()])->save();

        return response()->json(['message' => 'Email verified.']);
    }
}
