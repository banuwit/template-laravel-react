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

test('authenticated users can visit the city list', function () {
    $user = User::factory()->create();
    $country = Country::factory()->create([
        'name' => 'Indonesia',
        'code' => 'ID',
    ]);
    $province = Province::factory()->create([
        'country_id' => $country->id,
        'name' => 'West Java',
        'code' => '32',
    ]);
    $bandung = City::factory()->create([
        'province_id' => $province->id,
        'name' => 'Bandung',
        'code' => '3273',
        'created_at' => now()->subMinute(),
    ]);
    $bekasi = City::factory()->create([
        'province_id' => $province->id,
        'name' => 'Bekasi',
        'code' => '3216',
        'created_at' => now(),
    ]);

    $this->actingAs($user)
        ->get(route('cities.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('cities/index')
            ->has('cities.data', 2)
            ->where('cities.data.0.id', $bekasi->id)
            ->where('cities.data.0.province.name', 'West Java')
            ->where('cities.data.0.province.country.name', 'Indonesia')
            ->where('cities.data.0.can_delete', true)
            ->where('cities.data.1.id', $bandung->id)
            ->has('provinces', 1)
            ->where('filters.sort', 'created_at')
            ->where('filters.direction', 'desc'),
        );
});

test('cities can be searched by name, code, province, or country', function () {
    $user = User::factory()->create();
    $country = Country::factory()->create([
        'name' => 'Indonesia',
        'code' => 'ID',
    ]);
    $province = Province::factory()->create([
        'country_id' => $country->id,
        'name' => 'West Java',
        'code' => '32',
    ]);

    City::factory()->create([
        'province_id' => $province->id,
        'name' => 'Bandung',
        'code' => '3273',
    ]);

    City::factory()->create([
        'province_id' => Province::factory()->create([
            'country_id' => Country::factory()->create(['code' => 'JP'])->id,
            'name' => 'Tokyo',
            'code' => '13',
        ])->id,
        'name' => 'Shibuya',
        'code' => '1311',
    ]);

    $this->actingAs($user)
        ->get(route('cities.index', ['search' => 'Bandung']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('cities/index')
            ->has('cities.data', 1)
            ->where('cities.data.0.name', 'Bandung')
            ->where('filters.search', 'Bandung'),
        );
});

test('cities can be sorted by name', function () {
    $user = User::factory()->create();
    $province = Province::factory()->create();

    City::factory()->create([
        'province_id' => $province->id,
        'name' => 'Cimahi',
        'code' => '0003',
    ]);

    City::factory()->create([
        'province_id' => $province->id,
        'name' => 'Bandung',
        'code' => '0001',
    ]);

    City::factory()->create([
        'province_id' => $province->id,
        'name' => 'Bekasi',
        'code' => '0002',
    ]);

    $this->actingAs($user)
        ->get(route('cities.index', ['sort' => 'name', 'direction' => 'asc']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('cities/index')
            ->where('cities.data.0.name', 'Bandung')
            ->where('cities.data.1.name', 'Bekasi')
            ->where('cities.data.2.name', 'Cimahi')
            ->where('filters.sort', 'name')
            ->where('filters.direction', 'asc'),
        );
});

test('cities can be sorted by province', function () {
    $user = User::factory()->create();
    $country = Country::factory()->create();
    $java = Province::factory()->create([
        'country_id' => $country->id,
        'name' => 'West Java',
        'code' => '32',
    ]);
    $bali = Province::factory()->create([
        'country_id' => $country->id,
        'name' => 'Bali',
        'code' => '51',
    ]);

    City::factory()->create([
        'province_id' => $java->id,
        'name' => 'Bandung',
        'code' => '3273',
    ]);

    City::factory()->create([
        'province_id' => $bali->id,
        'name' => 'Denpasar',
        'code' => '5171',
    ]);

    $this->actingAs($user)
        ->get(route('cities.index', ['sort' => 'province', 'direction' => 'asc']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('cities/index')
            ->where('cities.data.0.province.name', 'Bali')
            ->where('cities.data.1.province.name', 'West Java')
            ->where('filters.sort', 'province')
            ->where('filters.direction', 'asc'),
        );
});

test('cities can be sorted by country', function () {
    $user = User::factory()->create();
    $indonesia = Country::factory()->create(['name' => 'Indonesia', 'code' => 'ID']);
    $japan = Country::factory()->create(['name' => 'Japan', 'code' => 'JP']);
    $java = Province::factory()->create(['country_id' => $indonesia->id, 'name' => 'West Java', 'code' => '32']);
    $tokyo = Province::factory()->create(['country_id' => $japan->id, 'name' => 'Tokyo', 'code' => '13']);

    City::factory()->create(['province_id' => $java->id, 'name' => 'Bandung', 'code' => '3273']);
    City::factory()->create(['province_id' => $tokyo->id, 'name' => 'Shibuya', 'code' => '1311']);

    $this->actingAs($user)
        ->get(route('cities.index', ['sort' => 'country', 'direction' => 'asc']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('cities/index')
            ->where('cities.data.0.province.country.name', 'Indonesia')
            ->where('cities.data.1.province.country.name', 'Japan')
            ->where('filters.sort', 'country')
            ->where('filters.direction', 'asc'),
        );
});

test('the city list is paginated', function () {
    $user = User::factory()->create();
    $province = Province::factory()->create();
    City::factory()->count(11)->create(['province_id' => $province->id]);

    $this->actingAs($user)
        ->get(route('cities.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('cities/index')
            ->has('cities.data', 10)
            ->where('cities.total', 11)
            ->where('cities.last_page', 2)
            ->where('cities.current_page', 1),
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
