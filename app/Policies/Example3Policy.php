<?php

namespace App\Policies;

use App\Models\Example3;
use App\Models\User;

class Example3Policy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Example3 $example3): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Example3 $example3): bool
    {
        return true;
    }

    public function delete(User $user, Example3 $example3): bool
    {
        return true;
    }
}
