<?php

use App\Models\Country;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function () {
    $this->get(route('countries.index'))
        ->assertRedirect(route('login'));
});

test('authenticated users can visit the country list', function () {
    $user = User::factory()->create();
    $indonesia = Country::factory()->create([
        'name' => 'Indonesia',
        'code' => 'ID',
        'created_at' => now()->subMinute(),
    ]);
    $japan = Country::factory()->create([
        'name' => 'Japan',
        'code' => 'JP',
        'created_at' => now(),
    ]);

    $this->actingAs($user)
        ->get(route('countries.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('countries/index')
            ->has('countries.data', 2)
            ->where('countries.data.0.id', $japan->id)
            ->where('countries.data.0.can_delete', true)
            ->where('countries.data.1.id', $indonesia->id)
            ->where('filters.sort', 'created_at')
            ->where('filters.direction', 'desc'),
        );
});

test('countries can be searched by name or code', function () {
    $user = User::factory()->create();

    Country::factory()->create([
        'name' => 'Indonesia',
        'code' => 'ID',
    ]);

    Country::factory()->create([
        'name' => 'Japan',
        'code' => 'JP',
    ]);

    $this->actingAs($user)
        ->get(route('countries.index', ['search' => 'Indo']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('countries/index')
            ->has('countries.data', 1)
            ->where('countries.data.0.code', 'ID')
            ->where('filters.search', 'Indo'),
        );
});

test('countries can be sorted by name', function () {
    $user = User::factory()->create();

    Country::factory()->create([
        'name' => 'Canada',
        'code' => 'CA',
    ]);

    Country::factory()->create([
        'name' => 'Brazil',
        'code' => 'BR',
    ]);

    Country::factory()->create([
        'name' => 'Australia',
        'code' => 'AU',
    ]);

    $this->actingAs($user)
        ->get(route('countries.index', ['sort' => 'name', 'direction' => 'asc']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('countries/index')
            ->where('countries.data.0.name', 'Australia')
            ->where('countries.data.1.name', 'Brazil')
            ->where('countries.data.2.name', 'Canada')
            ->where('filters.sort', 'name')
            ->where('filters.direction', 'asc'),
        );
});

test('the country list is paginated', function () {
    $user = User::factory()->create();
    Country::factory()->count(11)->create();

    $this->actingAs($user)
        ->get(route('countries.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('countries/index')
            ->has('countries.data', 10)
            ->where('countries.total', 11)
            ->where('countries.last_page', 2)
            ->where('countries.current_page', 1),
        );
});

test('invalid sort columns are rejected', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->from(route('countries.index'))
        ->get(route('countries.index', ['sort' => 'id']))
        ->assertRedirect(route('countries.index'))
        ->assertSessionHasErrors('sort');
});
