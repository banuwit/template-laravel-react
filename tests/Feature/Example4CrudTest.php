<?php

use App\Models\Example4;
use App\Models\User;
use Illuminate\Support\Facades\Route;

test('create, show, and edit example4 pages are not registered', function () {
    expect(Route::has('example4.create'))->toBeFalse()
        ->and(Route::has('example4.show'))->toBeFalse()
        ->and(Route::has('example4.edit'))->toBeFalse();
});

test('guests cannot create an example4 record', function () {
    $this->post(route('example4.store'), validExampleRecordPayload())
        ->assertRedirect(route('login'));
});

test('an example4 record can be created', function () {
    $actor = User::factory()->create();

    $this->actingAs($actor)
        ->post(route('example4.store'), validExampleRecordPayload([
            'email' => 'new.hire@example.com',
        ]))
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('example4.index'));

    $created = Example4::query()->where('email', 'new.hire@example.com')->first();

    expect($created)->not->toBeNull()
        ->and($created?->name)->toBe('Alex Rivera')
        ->and($created?->department)->toBe('Engineering')
        ->and($created?->gender->value)->toBe('male');
});

test('creating an example4 record requires a unique email', function () {
    $actor = User::factory()->create();
    Example4::factory()->create(['email' => 'taken@example.com']);

    $this->actingAs($actor)
        ->from(route('example4.index'))
        ->post(route('example4.store'), validExampleRecordPayload([
            'email' => 'taken@example.com',
        ]))
        ->assertSessionHasErrors('email')
        ->assertRedirect(route('example4.index'));
});

test('creating an example4 record requires a valid gender', function () {
    $actor = User::factory()->create();

    $this->actingAs($actor)
        ->from(route('example4.index'))
        ->post(route('example4.store'), validExampleRecordPayload([
            'gender' => 'invalid',
        ]))
        ->assertSessionHasErrors('gender')
        ->assertRedirect(route('example4.index'));
});

test('an example4 record can be updated', function () {
    $actor = User::factory()->create();
    $record = Example4::factory()->create([
        'name' => 'Before Update',
        'email' => 'before@example.com',
    ]);

    $this->actingAs($actor)
        ->put(route('example4.update', $record), validExampleRecordPayload([
            'name' => 'After Update',
            'email' => 'after@example.com',
            'department' => 'Marketing',
        ]))
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('example4.index'));

    $record->refresh();

    expect($record->name)->toBe('After Update')
        ->and($record->email)->toBe('after@example.com')
        ->and($record->department)->toBe('Marketing');
});

test('updating an example4 record ignores its own unique email', function () {
    $actor = User::factory()->create();
    $record = Example4::factory()->create([
        'email' => 'same@example.com',
    ]);

    $this->actingAs($actor)
        ->put(route('example4.update', $record), validExampleRecordPayload([
            'email' => 'same@example.com',
        ]))
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('example4.index'));
});

test('an example4 record can be deleted', function () {
    $actor = User::factory()->create();
    $record = Example4::factory()->create();

    $this->actingAs($actor)
        ->delete(route('example4.destroy', $record))
        ->assertRedirect(route('example4.index'));

    expect($record->fresh())->toBeNull();
});
