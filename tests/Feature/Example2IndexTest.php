<?php

use App\Models\Example2;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function () {
    $this->get(route('example2.index'))
        ->assertRedirect(route('login'));
});

test('authenticated users can visit the example2 list', function () {
    $user = User::factory()->create();
    $older = Example2::factory()->create([
        'name' => 'Older Record',
        'email' => 'older@example.com',
        'created_at' => now()->subMinute(),
    ]);
    $newer = Example2::factory()->create([
        'name' => 'Newer Record',
        'email' => 'newer@example.com',
        'created_at' => now(),
    ]);

    $this->actingAs($user)
        ->get(route('example2.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('example2/index')
            ->has('example2.data', 2)
            ->where('example2.data.0.id', $newer->id)
            ->where('example2.data.0.can_delete', true)
            ->where('example2.data.1.id', $older->id)
            ->where('filters.sort', 'created_at')
            ->where('filters.direction', 'desc'),
        );
});

test('example2 records can be searched by name or department', function () {
    $user = User::factory()->create();

    Example2::factory()->create([
        'name' => 'Alex Rivera',
        'email' => 'alex@example.com',
        'department' => 'Engineering',
        'position' => 'Software Engineer',
    ]);

    Example2::factory()->create([
        'name' => 'Jordan Lee',
        'email' => 'jordan@example.com',
        'department' => 'Marketing',
        'position' => 'Campaign Manager',
    ]);

    $this->actingAs($user)
        ->get(route('example2.index', ['search' => 'Engineering']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('example2/index')
            ->has('example2.data', 1)
            ->where('example2.data.0.email', 'alex@example.com')
            ->where('filters.search', 'Engineering'),
        );
});

test('example2 records can be sorted by department', function () {
    $user = User::factory()->create();

    Example2::factory()->create([
        'name' => 'Charlie',
        'email' => 'charlie@example.com',
        'department' => 'Operations',
    ]);

    Example2::factory()->create([
        'name' => 'Bravo',
        'email' => 'bravo@example.com',
        'department' => 'Engineering',
    ]);

    Example2::factory()->create([
        'name' => 'Alpha',
        'email' => 'alpha@example.com',
        'department' => 'Finance',
    ]);

    $this->actingAs($user)
        ->get(route('example2.index', ['sort' => 'department', 'direction' => 'asc']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('example2/index')
            ->where('example2.data.0.department', 'Engineering')
            ->where('example2.data.1.department', 'Finance')
            ->where('example2.data.2.department', 'Operations')
            ->where('filters.sort', 'department')
            ->where('filters.direction', 'asc'),
        );
});

test('the example2 list is paginated', function () {
    $user = User::factory()->create();
    Example2::factory()->count(11)->create();

    $this->actingAs($user)
        ->get(route('example2.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('example2/index')
            ->has('example2.data', 10)
            ->where('example2.total', 11)
            ->where('example2.last_page', 2)
            ->where('example2.current_page', 1),
        );
});

test('invalid sort columns are rejected for example2', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->from(route('example2.index'))
        ->get(route('example2.index', ['sort' => 'id']))
        ->assertRedirect(route('example2.index'))
        ->assertSessionHasErrors('sort');
});
