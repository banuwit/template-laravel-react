<?php

use App\Models\City;
use App\Models\Province;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Route;

test('create, show, and edit city pages are not registered', function () {
    expect(Route::has('cities.create'))->toBeFalse()
        ->and(Route::has('cities.show'))->toBeFalse()
        ->and(Route::has('cities.edit'))->toBeFalse();
});

test('guests cannot create a city', function () {
    $province = Province::factory()->create();

    $this->post(route('cities.store'), ['province_id' => $province->id, 'name' => 'Bandung'])
        ->assertRedirect(route('login'));
});

test('a city can be created', function () {
    $actor = User::factory()->create();
    $province = Province::factory()->create();

    $this->actingAs($actor)
        ->post(route('cities.store'), ['province_id' => $province->id, 'name' => 'Bandung'])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('cities.index'));

    $created = City::query()->where('name', 'Bandung')->first();

    expect($created)->not->toBeNull()
        ->and($created?->province_id)->toBe($province->id);
});

test('creating a city requires an existing province', function () {
    $actor = User::factory()->create();

    $this->actingAs($actor)
        ->from(route('cities.index'))
        ->post(route('cities.store'), ['province_id' => 999999, 'name' => 'Bandung'])
        ->assertSessionHasErrors('province_id')
        ->assertRedirect(route('cities.index'));
});

test('creating a city requires a name unique within its province', function () {
    $actor = User::factory()->create();
    $province = Province::factory()->create();
    City::factory()->create(['province_id' => $province->id, 'name' => 'Bandung']);

    $this->actingAs($actor)
        ->from(route('cities.index'))
        ->post(route('cities.store'), ['province_id' => $province->id, 'name' => 'Bandung'])
        ->assertSessionHasErrors('name')
        ->assertRedirect(route('cities.index'));
});

test('the same city name is allowed across different provinces', function () {
    $actor = User::factory()->create();
    $westJava = Province::factory()->create();
    $bali = Province::factory()->create();
    City::factory()->create(['province_id' => $westJava->id, 'name' => 'Central']);

    $this->actingAs($actor)
        ->post(route('cities.store'), ['province_id' => $bali->id, 'name' => 'Central'])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('cities.index'));
});

test('a city can be updated', function () {
    $actor = User::factory()->create();
    $province = Province::factory()->create();
    $city = City::factory()->create(['province_id' => $province->id, 'name' => 'Before Update']);

    $this->actingAs($actor)
        ->put(route('cities.update', $city), ['province_id' => $province->id, 'name' => 'After Update'])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('cities.index'));

    $city->refresh();

    expect($city->name)->toBe('After Update');
});

test('updating a city ignores its own unique name within the province', function () {
    $actor = User::factory()->create();
    $province = Province::factory()->create();
    $city = City::factory()->create(['province_id' => $province->id, 'name' => 'Bandung']);

    $this->actingAs($actor)
        ->put(route('cities.update', $city), ['province_id' => $province->id, 'name' => 'Bandung'])
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

test('a province with cities cannot be deleted', function () {
    $province = Province::factory()->create();
    City::factory()->create(['province_id' => $province->id]);

    expect(fn () => $province->delete())->toThrow(QueryException::class);
});
