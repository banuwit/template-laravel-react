<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function () {
    $this->get(route('examples'))
        ->assertRedirect(route('login'));
});

test('authenticated users can visit the examples page', function () {
    $this->actingAs(User::factory()->create())
        ->get(route('examples'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('examples/index'),
        );
});
