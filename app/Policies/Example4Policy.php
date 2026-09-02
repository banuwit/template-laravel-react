<?php

namespace App\Policies;

use App\Models\Example4;
use App\Models\User;

class Example4Policy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Example4 $example4): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Example4 $example4): bool
    {
        return true;
    }

    public function delete(User $user, Example4 $example4): bool
    {
        return true;
    }
}
