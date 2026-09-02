<?php

namespace App\Policies;

use App\Models\Province;
use App\Models\User;

class ProvincePolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Province $province): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Province $province): bool
    {
        return true;
    }

    public function delete(User $user, Province $province): bool
    {
        return true;
    }
}
