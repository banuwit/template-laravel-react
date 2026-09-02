<?php

use App\Models\City;
use App\Models\Country;
use App\Models\Province;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function () {
    $this->get(route('cities.index'))
        ->assertRedirect(route('login'));
});

test('authenticated users can visit the cities list', function () {
    $user = User::factory()->create();
    $indonesia = Country::factory()->create(['name' => 'Indonesia', 'code' => 'ID']);
    $westJava = Province::factory()->create(['country_id' => $indonesia->id, 'name' => 'West Java']);
    $bandung = City::factory()->create(['province_id' => $westJava->id, 'name' => 'Bandung']);
    $bekasi = City::factory()->create(['province_id' => $westJava->id, 'name' => 'Bekasi']);

    $this->actingAs($user)
        ->get(route('cities.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('cities/index')
            ->has('cities.data', 2)
            ->where('cities.data.0.id', $bandung->id)
            ->where('cities.data.0.province_name', 'West Java')
            ->where('cities.data.0.country_name', 'Indonesia')
            ->where('cities.data.0.can_delete', true)
            ->where('cities.data.1.id', $bekasi->id)
            ->where('filters.sort', 'name')
            ->where('filters.direction', 'asc'),
        );
});

test('cities can be searched by name or province name', function () {
    $user = User::factory()->create();
    $westJava = Province::factory()->create(['name' => 'West Java']);
    $bali = Province::factory()->create(['name' => 'Bali']);

    City::factory()->create(['province_id' => $westJava->id, 'name' => 'Bandung']);
    City::factory()->create(['province_id' => $bali->id, 'name' => 'Denpasar']);

    $this->actingAs($user)
        ->get(route('cities.index', ['search' => 'Bandung']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('cities/index')
            ->has('cities.data', 1)
            ->where('cities.data.0.name', 'Bandung'),
        );

    $this->actingAs($user)
        ->get(route('cities.index', ['search' => 'Bali']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('cities/index')
            ->has('cities.data', 1)
            ->where('cities.data.0.name', 'Denpasar'),
        );
});

test('invalid sort columns are rejected', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->from(route('cities.index'))
        ->get(route('cities.index', ['sort' => 'id']))
        ->assertRedirect(route('cities.index'))
        ->assertSessionHasErrors('sort');
});
