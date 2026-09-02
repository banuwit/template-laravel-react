<?php

use App\Models\Country;
use App\Models\User;
use Illuminate\Support\Facades\Route;

test('create, show, and edit country pages are not registered', function () {
    expect(Route::has('countries.create'))->toBeFalse()
        ->and(Route::has('countries.show'))->toBeFalse()
        ->and(Route::has('countries.edit'))->toBeFalse();
});

test('guests cannot create a country', function () {
    $this->post(route('countries.store'), ['name' => 'Indonesia', 'code' => 'ID'])
        ->assertRedirect(route('login'));
});

test('a country can be created', function () {
    $actor = User::factory()->create();

    $this->actingAs($actor)
        ->post(route('countries.store'), ['name' => 'Indonesia', 'code' => 'ID'])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('countries.index'));

    $created = Country::query()->where('code', 'ID')->first();

    expect($created)->not->toBeNull()
        ->and($created?->name)->toBe('Indonesia');
});

test('creating a country requires a unique name', function () {
    $actor = User::factory()->create();
    Country::factory()->create(['name' => 'Indonesia']);

    $this->actingAs($actor)
        ->from(route('countries.index'))
        ->post(route('countries.store'), ['name' => 'Indonesia', 'code' => 'AU'])
        ->assertSessionHasErrors('name')
        ->assertRedirect(route('countries.index'));
});

test('creating a country requires a unique code', function () {
    $actor = User::factory()->create();
    Country::factory()->create(['code' => 'ID']);

    $this->actingAs($actor)
        ->from(route('countries.index'))
        ->post(route('countries.store'), ['name' => 'Indonesia', 'code' => 'ID'])
        ->assertSessionHasErrors('code')
        ->assertRedirect(route('countries.index'));
});

test('creating a country requires a two-letter uppercase code', function () {
    $actor = User::factory()->create();

    $this->actingAs($actor)
        ->from(route('countries.index'))
        ->post(route('countries.store'), ['name' => 'Indonesia', 'code' => 'idn'])
        ->assertSessionHasErrors('code')
        ->assertRedirect(route('countries.index'));
});

test('a country can be updated', function () {
    $actor = User::factory()->create();
    $country = Country::factory()->create(['name' => 'Before Update', 'code' => 'BU']);

    $this->actingAs($actor)
        ->put(route('countries.update', $country), ['name' => 'After Update', 'code' => 'AU'])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('countries.index'));

    $country->refresh();

    expect($country->name)->toBe('After Update')
        ->and($country->code)->toBe('AU');
});

test('updating a country ignores its own unique name and code', function () {
    $actor = User::factory()->create();
    $country = Country::factory()->create(['name' => 'Indonesia', 'code' => 'ID']);

    $this->actingAs($actor)
        ->put(route('countries.update', $country), ['name' => 'Indonesia', 'code' => 'ID'])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('countries.index'));
});

test('a country can be deleted', function () {
    $actor = User::factory()->create();
    $country = Country::factory()->create();

    $this->actingAs($actor)
        ->delete(route('countries.destroy', $country))
        ->assertRedirect(route('countries.index'));

    expect($country->fresh())->toBeNull();
});
