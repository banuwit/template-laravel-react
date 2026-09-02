<?php

use App\Models\Country;
use App\Models\Province;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function () {
    $this->get(route('provinces.index'))
        ->assertRedirect(route('login'));
});

test('authenticated users can visit the provinces list', function () {
    $user = User::factory()->create();
    $indonesia = Country::factory()->create(['name' => 'Indonesia', 'code' => 'ID']);
    $jakarta = Province::factory()->create(['country_id' => $indonesia->id, 'name' => 'Jakarta']);
    $bali = Province::factory()->create(['country_id' => $indonesia->id, 'name' => 'Bali']);

    $this->actingAs($user)
        ->get(route('provinces.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('provinces/index')
            ->has('provinces.data', 2)
            ->where('provinces.data.0.id', $bali->id)
            ->where('provinces.data.0.country_name', 'Indonesia')
            ->where('provinces.data.0.can_delete', true)
            ->where('provinces.data.1.id', $jakarta->id)
            ->where('filters.sort', 'name')
            ->where('filters.direction', 'asc'),
        );
});

test('provinces can be searched by name or country name', function () {
    $user = User::factory()->create();
    $indonesia = Country::factory()->create(['name' => 'Indonesia', 'code' => 'ID']);
    $australia = Country::factory()->create(['name' => 'Australia', 'code' => 'AU']);

    Province::factory()->create(['country_id' => $indonesia->id, 'name' => 'Jakarta']);
    Province::factory()->create(['country_id' => $australia->id, 'name' => 'Queensland']);

    $this->actingAs($user)
        ->get(route('provinces.index', ['search' => 'Jakarta']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('provinces/index')
            ->has('provinces.data', 1)
            ->where('provinces.data.0.name', 'Jakarta'),
        );

    $this->actingAs($user)
        ->get(route('provinces.index', ['search' => 'Australia']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('provinces/index')
            ->has('provinces.data', 1)
            ->where('provinces.data.0.name', 'Queensland'),
        );
});

test('invalid sort columns are rejected', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->from(route('provinces.index'))
        ->get(route('provinces.index', ['sort' => 'id']))
        ->assertRedirect(route('provinces.index'))
        ->assertSessionHasErrors('sort');
});
