<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EmailVerificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_email_can_be_verified(): void
    {
        $user = User::factory()->unverified()->create();

        $response = $this->getJson('/api/auth/verify-email?id='.$user->id.'&hash='.sha1($user->email));

        $response->assertOk();
        $this->assertNotNull($user->fresh()->email_verified_at);
    }

    public function test_email_is_not_verified_with_invalid_hash(): void
    {
        $user = User::factory()->unverified()->create();

        $response = $this->getJson('/api/auth/verify-email?id='.$user->id.'&hash='.sha1('wrong-email'));

        $response->assertStatus(403);
        $this->assertNull($user->fresh()->email_verified_at);
    }
}
