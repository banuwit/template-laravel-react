<?php

use App\Models\City;
use App\Models\Country;
use App\Models\Province;
use App\Models\User;
use Illuminate\Support\Facades\Route;

test('create, show, and edit city pages are not registered', function () {
    expect(Route::has('cities.create'))->toBeFalse()
        ->and(Route::has('cities.show'))->toBeFalse()
        ->and(Route::has('cities.edit'))->toBeFalse();
});

test('guests cannot create a city', function () {
    $province = Province::factory()->create();

    $this->post(route('cities.store'), [
        'province_id' => $province->id,
        'name' => 'Bandung',
        'code' => '3273',
    ])->assertRedirect(route('login'));
});

test('a city can be created', function () {
    $actor = User::factory()->create();
    $province = Province::factory()->create([
        'name' => 'West Java',
        'code' => '32',
    ]);

    $this->actingAs($actor)
        ->post(route('cities.store'), [
            'province_id' => $province->id,
            'name' => 'Bandung',
            'code' => '3273',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('cities.index'));

    $created = City::query()->where('code', '3273')->first();

    expect($created)->not->toBeNull()
        ->and($created?->name)->toBe('Bandung')
        ->and($created?->province_id)->toBe($province->id);
});

test('creating a city requires a unique name within the province', function () {
    $actor = User::factory()->create();
    $province = Province::factory()->create();

    City::factory()->create([
        'province_id' => $province->id,
        'name' => 'Bandung',
        'code' => '3273',
    ]);

    $this->actingAs($actor)
        ->from(route('cities.index'))
        ->post(route('cities.store'), [
            'province_id' => $province->id,
            'name' => 'Bandung',
            'code' => '3274',
        ])
        ->assertSessionHasErrors('name')
        ->assertRedirect(route('cities.index'));
});

test('creating a city requires a unique code within the province', function () {
    $actor = User::factory()->create();
    $province = Province::factory()->create();

    City::factory()->create([
        'province_id' => $province->id,
        'name' => 'Bandung',
        'code' => '3273',
    ]);

    $this->actingAs($actor)
        ->from(route('cities.index'))
        ->post(route('cities.store'), [
            'province_id' => $province->id,
            'name' => 'Bekasi',
            'code' => '3273',
        ])
        ->assertSessionHasErrors('code')
        ->assertRedirect(route('cities.index'));
});

test('the same city name and code may exist in different provinces', function () {
    $actor = User::factory()->create();
    $country = Country::factory()->create();
    $westJava = Province::factory()->create([
        'country_id' => $country->id,
        'name' => 'West Java',
        'code' => '32',
    ]);
    $centralJava = Province::factory()->create([
        'country_id' => $country->id,
        'name' => 'Central Java',
        'code' => '33',
    ]);

    City::factory()->create([
        'province_id' => $westJava->id,
        'name' => 'Salatiga',
        'code' => '3374',
    ]);

    $this->actingAs($actor)
        ->post(route('cities.store'), [
            'province_id' => $centralJava->id,
            'name' => 'Salatiga',
            'code' => '3374',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('cities.index'));

    expect(City::query()->count())->toBe(2);
});

test('a city can be updated', function () {
    $actor = User::factory()->create();
    $province = Province::factory()->create();
    $otherProvince = Province::factory()->create();
    $city = City::factory()->create([
        'province_id' => $province->id,
        'name' => 'Bandung',
        'code' => '3273',
    ]);

    $this->actingAs($actor)
        ->put(route('cities.update', $city), [
            'province_id' => $otherProvince->id,
            'name' => 'Bandung City',
            'code' => '3273',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('cities.index'));

    $city->refresh();

    expect($city->name)->toBe('Bandung City')
        ->and($city->province_id)->toBe($otherProvince->id)
        ->and($city->code)->toBe('3273');
});

test('updating a city ignores its own unique name and code', function () {
    $actor = User::factory()->create();
    $province = Province::factory()->create();
    $city = City::factory()->create([
        'province_id' => $province->id,
        'name' => 'Bandung',
        'code' => '3273',
    ]);

    $this->actingAs($actor)
        ->put(route('cities.update', $city), [
            'province_id' => $province->id,
            'name' => 'Bandung',
            'code' => '3273',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('cities.index'));
});

test('a city can be deleted', function () {
    $actor = User::factory()->create();
    $city = City::factory()->create();

    $this->actingAs($actor)
        ->delete(route('cities.destroy', $city))
        ->assertRedirect(route('cities.index'));

    expect($city->fresh())->toBeNull();
});
