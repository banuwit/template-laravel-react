<?php

use App\Models\Example3;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function () {
    $this->get(route('example3.index'))
        ->assertRedirect(route('login'));
});

test('authenticated users can visit the example3 list', function () {
    $user = User::factory()->create();
    $older = Example3::factory()->create([
        'name' => 'Older Record',
        'email' => 'older@example.com',
        'created_at' => now()->subMinute(),
    ]);
    $newer = Example3::factory()->create([
        'name' => 'Newer Record',
        'email' => 'newer@example.com',
        'created_at' => now(),
    ]);

    $this->actingAs($user)
        ->get(route('example3.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('example3/index')
            ->has('example3.data', 2)
            ->where('example3.data.0.id', $newer->id)
            ->where('example3.data.0.can_delete', true)
            ->where('example3.data.1.id', $older->id)
            ->where('filters.sort', 'created_at')
            ->where('filters.direction', 'desc'),
        );
});

test('example3 records can be searched by name or department', function () {
    $user = User::factory()->create();

    Example3::factory()->create([
        'name' => 'Alex Rivera',
        'email' => 'alex@example.com',
        'department' => 'Engineering',
    ]);

    Example3::factory()->create([
        'name' => 'Jordan Lee',
        'email' => 'jordan@example.com',
        'department' => 'Marketing',
    ]);

    $this->actingAs($user)
        ->get(route('example3.index', ['search' => 'Engineering']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('example3/index')
            ->has('example3.data', 1)
            ->where('example3.data.0.email', 'alex@example.com')
            ->where('filters.search', 'Engineering'),
        );
});

test('example3 records can be sorted by department', function () {
    $user = User::factory()->create();

    Example3::factory()->create([
        'name' => 'Charlie',
        'email' => 'charlie@example.com',
        'department' => 'Operations',
    ]);

    Example3::factory()->create([
        'name' => 'Bravo',
        'email' => 'bravo@example.com',
        'department' => 'Engineering',
    ]);

    Example3::factory()->create([
        'name' => 'Alpha',
        'email' => 'alpha@example.com',
        'department' => 'Finance',
    ]);

    $this->actingAs($user)
        ->get(route('example3.index', ['sort' => 'department', 'direction' => 'asc']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('example3/index')
            ->where('example3.data.0.department', 'Engineering')
            ->where('example3.data.1.department', 'Finance')
            ->where('example3.data.2.department', 'Operations')
            ->where('filters.sort', 'department')
            ->where('filters.direction', 'asc'),
        );
});

test('the example3 list is paginated', function () {
    $user = User::factory()->create();
    Example3::factory()->count(11)->create();

    $this->actingAs($user)
        ->get(route('example3.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('example3/index')
            ->has('example3.data', 10)
            ->where('example3.total', 11)
            ->where('example3.last_page', 2)
            ->where('example3.current_page', 1),
        );
});

test('invalid sort columns are rejected for example3', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->from(route('example3.index'))
        ->get(route('example3.index', ['sort' => 'id']))
        ->assertRedirect(route('example3.index'))
        ->assertSessionHasErrors('sort');
});
