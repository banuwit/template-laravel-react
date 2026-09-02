<?php

use App\Models\Country;
use App\Models\Province;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Route;

test('create, show, and edit province pages are not registered', function () {
    expect(Route::has('provinces.create'))->toBeFalse()
        ->and(Route::has('provinces.show'))->toBeFalse()
        ->and(Route::has('provinces.edit'))->toBeFalse();
});

test('guests cannot create a province', function () {
    $country = Country::factory()->create();

    $this->post(route('provinces.store'), ['country_id' => $country->id, 'name' => 'Jakarta'])
        ->assertRedirect(route('login'));
});

test('a province can be created', function () {
    $actor = User::factory()->create();
    $country = Country::factory()->create();

    $this->actingAs($actor)
        ->post(route('provinces.store'), ['country_id' => $country->id, 'name' => 'Jakarta'])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('provinces.index'));

    $created = Province::query()->where('name', 'Jakarta')->first();

    expect($created)->not->toBeNull()
        ->and($created?->country_id)->toBe($country->id);
});

test('creating a province requires an existing country', function () {
    $actor = User::factory()->create();

    $this->actingAs($actor)
        ->from(route('provinces.index'))
        ->post(route('provinces.store'), ['country_id' => 999999, 'name' => 'Jakarta'])
        ->assertSessionHasErrors('country_id')
        ->assertRedirect(route('provinces.index'));
});

test('creating a province requires a name unique within its country', function () {
    $actor = User::factory()->create();
    $country = Country::factory()->create();
    Province::factory()->create(['country_id' => $country->id, 'name' => 'Jakarta']);

    $this->actingAs($actor)
        ->from(route('provinces.index'))
        ->post(route('provinces.store'), ['country_id' => $country->id, 'name' => 'Jakarta'])
        ->assertSessionHasErrors('name')
        ->assertRedirect(route('provinces.index'));
});

test('the same province name is allowed across different countries', function () {
    $actor = User::factory()->create();
    $indonesia = Country::factory()->create();
    $otherCountry = Country::factory()->create();
    Province::factory()->create(['country_id' => $indonesia->id, 'name' => 'Central']);

    $this->actingAs($actor)
        ->post(route('provinces.store'), ['country_id' => $otherCountry->id, 'name' => 'Central'])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('provinces.index'));
});

test('a province can be updated', function () {
    $actor = User::factory()->create();
    $country = Country::factory()->create();
    $province = Province::factory()->create(['country_id' => $country->id, 'name' => 'Before Update']);

    $this->actingAs($actor)
        ->put(route('provinces.update', $province), ['country_id' => $country->id, 'name' => 'After Update'])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('provinces.index'));

    $province->refresh();

    expect($province->name)->toBe('After Update');
});

test('updating a province ignores its own unique name within the country', function () {
    $actor = User::factory()->create();
    $country = Country::factory()->create();
    $province = Province::factory()->create(['country_id' => $country->id, 'name' => 'Jakarta']);

    $this->actingAs($actor)
        ->put(route('provinces.update', $province), ['country_id' => $country->id, 'name' => 'Jakarta'])
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

test('a country with provinces cannot be deleted', function () {
    $country = Country::factory()->create();
    Province::factory()->create(['country_id' => $country->id]);

    expect(fn () => $country->delete())->toThrow(QueryException::class);
});
