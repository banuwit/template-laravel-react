<?php

use App\Models\Country;
use App\Models\Province;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function () {
    $this->get(route('provinces.index'))
        ->assertRedirect(route('login'));
});

test('authenticated users can visit the province list', function () {
    $user = User::factory()->create();
    $country = Country::factory()->create([
        'name' => 'Indonesia',
        'code' => 'ID',
    ]);
    $westJava = Province::factory()->create([
        'country_id' => $country->id,
        'name' => 'West Java',
        'code' => '32',
        'created_at' => now()->subMinute(),
    ]);
    $bali = Province::factory()->create([
        'country_id' => $country->id,
        'name' => 'Bali',
        'code' => '51',
        'created_at' => now(),
    ]);

    $this->actingAs($user)
        ->get(route('provinces.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('provinces/index')
            ->has('provinces.data', 2)
            ->where('provinces.data.0.id', $bali->id)
            ->where('provinces.data.0.country.name', 'Indonesia')
            ->where('provinces.data.0.can_delete', true)
            ->where('provinces.data.1.id', $westJava->id)
            ->has('countries', 1)
            ->where('filters.sort', 'created_at')
            ->where('filters.direction', 'desc'),
        );
});

test('provinces can be searched by name, code, or country', function () {
    $user = User::factory()->create();
    $indonesia = Country::factory()->create([
        'name' => 'Indonesia',
        'code' => 'ID',
    ]);
    $japan = Country::factory()->create([
        'name' => 'Japan',
        'code' => 'JP',
    ]);

    Province::factory()->create([
        'country_id' => $indonesia->id,
        'name' => 'West Java',
        'code' => '32',
    ]);

    Province::factory()->create([
        'country_id' => $japan->id,
        'name' => 'Tokyo',
        'code' => '13',
    ]);

    $this->actingAs($user)
        ->get(route('provinces.index', ['search' => 'Indonesia']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('provinces/index')
            ->has('provinces.data', 1)
            ->where('provinces.data.0.name', 'West Java')
            ->where('filters.search', 'Indonesia'),
        );
});

test('provinces can be sorted by name', function () {
    $user = User::factory()->create();
    $country = Country::factory()->create();

    Province::factory()->create([
        'country_id' => $country->id,
        'name' => 'Central Java',
        'code' => '33',
    ]);

    Province::factory()->create([
        'country_id' => $country->id,
        'name' => 'Bali',
        'code' => '51',
    ]);

    Province::factory()->create([
        'country_id' => $country->id,
        'name' => 'Aceh',
        'code' => '11',
    ]);

    $this->actingAs($user)
        ->get(route('provinces.index', ['sort' => 'name', 'direction' => 'asc']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('provinces/index')
            ->where('provinces.data.0.name', 'Aceh')
            ->where('provinces.data.1.name', 'Bali')
            ->where('provinces.data.2.name', 'Central Java')
            ->where('filters.sort', 'name')
            ->where('filters.direction', 'asc'),
        );
});

test('provinces can be sorted by country', function () {
    $user = User::factory()->create();
    $indonesia = Country::factory()->create([
        'name' => 'Indonesia',
        'code' => 'ID',
    ]);
    $japan = Country::factory()->create([
        'name' => 'Japan',
        'code' => 'JP',
    ]);

    Province::factory()->create([
        'country_id' => $japan->id,
        'name' => 'Tokyo',
        'code' => '13',
    ]);

    Province::factory()->create([
        'country_id' => $indonesia->id,
        'name' => 'Bali',
        'code' => '51',
    ]);

    $this->actingAs($user)
        ->get(route('provinces.index', ['sort' => 'country', 'direction' => 'asc']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('provinces/index')
            ->where('provinces.data.0.country.name', 'Indonesia')
            ->where('provinces.data.1.country.name', 'Japan')
            ->where('filters.sort', 'country')
            ->where('filters.direction', 'asc'),
        );
});

test('the province list is paginated', function () {
    $user = User::factory()->create();
    $country = Country::factory()->create();
    Province::factory()->count(11)->create([
        'country_id' => $country->id,
    ]);

    $this->actingAs($user)
        ->get(route('provinces.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('provinces/index')
            ->has('provinces.data', 10)
            ->where('provinces.total', 11)
            ->where('provinces.last_page', 2)
            ->where('provinces.current_page', 1),
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
