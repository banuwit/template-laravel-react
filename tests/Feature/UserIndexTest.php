<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function () {
    $this->get(route('users.index'))
        ->assertRedirect(route('login'));
});

test('authenticated users can visit the user list', function () {
    $user = User::factory()->create([
        'created_at' => now()->subMinute(),
    ]);
    $other = User::factory()->create([
        'created_at' => now(),
    ]);

    $this->actingAs($user)
        ->get(route('users.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('users/index')
            ->has('users.data', 2)
            ->where('users.data.0.id', $other->id)
            ->where('users.data.0.can_delete', true)
            ->where('users.data.1.id', $user->id)
            ->where('users.data.1.can_delete', false)
            ->where('filters.sort', 'created_at')
            ->where('filters.direction', 'desc'),
        );
});

test('users can be searched by name or email', function () {
    $user = User::factory()->create([
        'name' => 'Admin User',
        'email' => 'admin@example.com',
    ]);

    User::factory()->create([
        'name' => 'Alice Johnson',
        'email' => 'alice@example.com',
    ]);

    User::factory()->create([
        'name' => 'Bob Smith',
        'email' => 'bob@example.com',
    ]);

    $this->actingAs($user)
        ->get(route('users.index', ['search' => 'Alice']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('users/index')
            ->has('users.data', 1)
            ->where('users.data.0.email', 'alice@example.com')
            ->where('filters.search', 'Alice'),
        );
});

test('users can be sorted by name', function () {
    $user = User::factory()->create([
        'name' => 'Charlie',
        'email' => 'charlie@example.com',
    ]);

    User::factory()->create([
        'name' => 'Alice',
        'email' => 'alice@example.com',
    ]);

    User::factory()->create([
        'name' => 'Bob',
        'email' => 'bob@example.com',
    ]);

    $this->actingAs($user)
        ->get(route('users.index', ['sort' => 'name', 'direction' => 'asc']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('users/index')
            ->where('users.data.0.name', 'Alice')
            ->where('users.data.1.name', 'Bob')
            ->where('users.data.2.name', 'Charlie')
            ->where('filters.sort', 'name')
            ->where('filters.direction', 'asc'),
        );
});

test('the user list is paginated', function () {
    $user = User::factory()->create();
    User::factory()->count(10)->create();

    $this->actingAs($user)
        ->get(route('users.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('users/index')
            ->has('users.data', 10)
            ->where('users.total', 11)
            ->where('users.last_page', 2)
            ->where('users.current_page', 1),
        );
});

test('invalid sort columns are rejected', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->from(route('users.index'))
        ->get(route('users.index', ['sort' => 'password']))
        ->assertRedirect(route('users.index'))
        ->assertSessionHasErrors('sort');
});
