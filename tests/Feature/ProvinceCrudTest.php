<?php

use App\Models\Country;
use App\Models\Province;
use App\Models\User;
use Illuminate\Support\Facades\Route;

test('create, show, and edit province pages are not registered', function () {
    expect(Route::has('provinces.create'))->toBeFalse()
        ->and(Route::has('provinces.show'))->toBeFalse()
        ->and(Route::has('provinces.edit'))->toBeFalse();
});

test('guests cannot create a province', function () {
    $country = Country::factory()->create();

    $this->post(route('provinces.store'), [
        'country_id' => $country->id,
        'name' => 'West Java',
        'code' => '32',
    ])->assertRedirect(route('login'));
});

test('a province can be created', function () {
    $actor = User::factory()->create();
    $country = Country::factory()->create([
        'name' => 'Indonesia',
        'code' => 'ID',
    ]);

    $this->actingAs($actor)
        ->post(route('provinces.store'), [
            'country_id' => $country->id,
            'name' => 'West Java',
            'code' => '32',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('provinces.index'));

    $created = Province::query()->where('code', '32')->first();

    expect($created)->not->toBeNull()
        ->and($created?->name)->toBe('West Java')
        ->and($created?->country_id)->toBe($country->id);
});

test('creating a province requires a unique name within the country', function () {
    $actor = User::factory()->create();
    $country = Country::factory()->create();

    Province::factory()->create([
        'country_id' => $country->id,
        'name' => 'West Java',
        'code' => '32',
    ]);

    $this->actingAs($actor)
        ->from(route('provinces.index'))
        ->post(route('provinces.store'), [
            'country_id' => $country->id,
            'name' => 'West Java',
            'code' => '33',
        ])
        ->assertSessionHasErrors('name')
        ->assertRedirect(route('provinces.index'));
});

test('creating a province requires a unique code within the country', function () {
    $actor = User::factory()->create();
    $country = Country::factory()->create();

    Province::factory()->create([
        'country_id' => $country->id,
        'name' => 'West Java',
        'code' => '32',
    ]);

    $this->actingAs($actor)
        ->from(route('provinces.index'))
        ->post(route('provinces.store'), [
            'country_id' => $country->id,
            'name' => 'Central Java',
            'code' => '32',
        ])
        ->assertSessionHasErrors('code')
        ->assertRedirect(route('provinces.index'));
});

test('the same province name and code may exist in different countries', function () {
    $actor = User::factory()->create();
    $indonesia = Country::factory()->create(['code' => 'ID']);
    $malaysia = Country::factory()->create(['code' => 'MY']);

    Province::factory()->create([
        'country_id' => $indonesia->id,
        'name' => 'Sarawak',
        'code' => '13',
    ]);

    $this->actingAs($actor)
        ->post(route('provinces.store'), [
            'country_id' => $malaysia->id,
            'name' => 'Sarawak',
            'code' => '13',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('provinces.index'));

    expect(Province::query()->count())->toBe(2);
});

test('a province can be updated', function () {
    $actor = User::factory()->create();
    $country = Country::factory()->create();
    $otherCountry = Country::factory()->create();
    $province = Province::factory()->create([
        'country_id' => $country->id,
        'name' => 'West Java',
        'code' => '32',
    ]);

    $this->actingAs($actor)
        ->put(route('provinces.update', $province), [
            'country_id' => $otherCountry->id,
            'name' => 'Jawa Barat',
            'code' => '32',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('provinces.index'));

    $province->refresh();

    expect($province->name)->toBe('Jawa Barat')
        ->and($province->country_id)->toBe($otherCountry->id)
        ->and($province->code)->toBe('32');
});

test('updating a province ignores its own unique name and code', function () {
    $actor = User::factory()->create();
    $country = Country::factory()->create();
    $province = Province::factory()->create([
        'country_id' => $country->id,
        'name' => 'West Java',
        'code' => '32',
    ]);

    $this->actingAs($actor)
        ->put(route('provinces.update', $province), [
            'country_id' => $country->id,
            'name' => 'West Java',
            'code' => '32',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('provinces.index'));
});

test('a province can be deleted', function () {
    $actor = User::factory()->create();
    $province = Province::factory()->create();

    $this->actingAs($actor)
        ->delete(route('provinces.destroy', $province))
        ->assertRedirect(route('provinces.index'));

    expect($province->fresh())->toBeNull();
});
