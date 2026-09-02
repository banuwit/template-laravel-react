<?php

use App\Models\Country;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function () {
    $this->get(route('countries.index'))
        ->assertRedirect(route('login'));
});

test('authenticated users can visit the countries list', function () {
    $user = User::factory()->create();
    $indonesia = Country::factory()->create(['name' => 'Indonesia', 'code' => 'ID']);
    $australia = Country::factory()->create(['name' => 'Australia', 'code' => 'AU']);

    $this->actingAs($user)
        ->get(route('countries.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('countries/index')
            ->has('countries.data', 2)
            ->where('countries.data.0.id', $australia->id)
            ->where('countries.data.0.can_delete', true)
            ->where('countries.data.1.id', $indonesia->id)
            ->where('filters.sort', 'name')
            ->where('filters.direction', 'asc'),
        );
});

test('countries can be searched by name or code', function () {
    $user = User::factory()->create();

    Country::factory()->create(['name' => 'Indonesia', 'code' => 'ID']);
    Country::factory()->create(['name' => 'Australia', 'code' => 'AU']);

    $this->actingAs($user)
        ->get(route('countries.index', ['search' => 'Indonesia']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('countries/index')
            ->has('countries.data', 1)
            ->where('countries.data.0.name', 'Indonesia')
            ->where('filters.search', 'Indonesia'),
        );
});

test('countries can be sorted by code', function () {
    $user = User::factory()->create();

    Country::factory()->create(['name' => 'Indonesia', 'code' => 'ID']);
    Country::factory()->create(['name' => 'Australia', 'code' => 'AU']);

    $this->actingAs($user)
        ->get(route('countries.index', ['sort' => 'code', 'direction' => 'desc']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('countries/index')
            ->where('countries.data.0.code', 'ID')
            ->where('countries.data.1.code', 'AU')
            ->where('filters.sort', 'code')
            ->where('filters.direction', 'desc'),
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
