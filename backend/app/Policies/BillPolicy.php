<?php

namespace App\Policies;

use App\Models\Bill;
use App\Models\User;

class BillPolicy
{
    public function update(User $user, Bill $bill): bool
    {
        return $user->id === $bill->user_id;
    }

    public function delete(User $user, Bill $bill): bool
    {
        return $user->id === $bill->user_id;
    }
}
