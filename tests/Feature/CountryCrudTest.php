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
    $this->post(route('countries.store'), [
        'name' => 'Indonesia',
        'code' => 'ID',
    ])->assertRedirect(route('login'));
});

test('a country can be created', function () {
    $actor = User::factory()->create();

    $this->actingAs($actor)
        ->post(route('countries.store'), [
            'name' => 'Indonesia',
            'code' => 'id',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('countries.index'));

    $created = Country::query()->where('code', 'ID')->first();

    expect($created)->not->toBeNull()
        ->and($created?->name)->toBe('Indonesia')
        ->and($created?->code)->toBe('ID');
});

test('creating a country requires a unique name', function () {
    $actor = User::factory()->create();
    Country::factory()->create([
        'name' => 'Indonesia',
        'code' => 'ID',
    ]);

    $this->actingAs($actor)
        ->from(route('countries.index'))
        ->post(route('countries.store'), [
            'name' => 'Indonesia',
            'code' => 'IN',
        ])
        ->assertSessionHasErrors('name')
        ->assertRedirect(route('countries.index'));
});

test('creating a country requires a unique code', function () {
    $actor = User::factory()->create();
    Country::factory()->create([
        'name' => 'Indonesia',
        'code' => 'ID',
    ]);

    $this->actingAs($actor)
        ->from(route('countries.index'))
        ->post(route('countries.store'), [
            'name' => 'India',
            'code' => 'ID',
        ])
        ->assertSessionHasErrors('code')
        ->assertRedirect(route('countries.index'));
});

test('creating a country requires a two-letter code', function () {
    $actor = User::factory()->create();

    $this->actingAs($actor)
        ->from(route('countries.index'))
        ->post(route('countries.store'), [
            'name' => 'United States',
            'code' => 'USA',
        ])
        ->assertSessionHasErrors('code')
        ->assertRedirect(route('countries.index'));
});

test('a country can be updated', function () {
    $actor = User::factory()->create();
    $country = Country::factory()->create([
        'name' => 'Holland',
        'code' => 'NL',
    ]);

    $this->actingAs($actor)
        ->put(route('countries.update', $country), [
            'name' => 'Netherlands',
            'code' => 'nl',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('countries.index'));

    $country->refresh();

    expect($country->name)->toBe('Netherlands')
        ->and($country->code)->toBe('NL');
});

test('updating a country ignores its own unique name and code', function () {
    $actor = User::factory()->create();
    $country = Country::factory()->create([
        'name' => 'Indonesia',
        'code' => 'ID',
    ]);

    $this->actingAs($actor)
        ->put(route('countries.update', $country), [
            'name' => 'Indonesia',
            'code' => 'ID',
        ])
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
