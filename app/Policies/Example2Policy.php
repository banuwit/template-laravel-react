<?php

namespace App\Policies;

use App\Models\Example2;
use App\Models\User;

class Example2Policy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Example2 $example2): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Example2 $example2): bool
    {
        return true;
    }

    public function delete(User $user, Example2 $example2): bool
    {
        return true;
    }
}
