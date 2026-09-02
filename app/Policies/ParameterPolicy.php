<?php

namespace App\Policies;

use App\Models\Parameter;
use App\Models\User;

class ParameterPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Parameter $parameter): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Parameter $parameter): bool
    {
        return true;
    }

    public function delete(User $user, Parameter $parameter): bool
    {
        return ! $parameter->is_system;
    }
}
