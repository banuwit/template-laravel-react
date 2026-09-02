<?php

use App\Models\Example2;
use App\Models\User;
use Illuminate\Support\Facades\Route;

test('create, show, and edit example2 pages are not registered', function () {
    expect(Route::has('example2.create'))->toBeFalse()
        ->and(Route::has('example2.show'))->toBeFalse()
        ->and(Route::has('example2.edit'))->toBeFalse();
});

test('guests cannot create an example2 record', function () {
    $this->post(route('example2.store'), validExampleRecordPayload())
        ->assertRedirect(route('login'));
});

test('an example2 record can be created', function () {
    $actor = User::factory()->create();

    $this->actingAs($actor)
        ->post(route('example2.store'), validExampleRecordPayload([
            'email' => 'new.hire@example.com',
        ]))
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('example2.index'));

    $created = Example2::query()->where('email', 'new.hire@example.com')->first();

    expect($created)->not->toBeNull()
        ->and($created?->name)->toBe('Alex Rivera')
        ->and($created?->department)->toBe('Engineering')
        ->and($created?->gender->value)->toBe('male');
});

test('creating an example2 record requires a unique email', function () {
    $actor = User::factory()->create();
    Example2::factory()->create(['email' => 'taken@example.com']);

    $this->actingAs($actor)
        ->from(route('example2.index'))
        ->post(route('example2.store'), validExampleRecordPayload([
            'email' => 'taken@example.com',
        ]))
        ->assertSessionHasErrors('email')
        ->assertRedirect(route('example2.index'));
});

test('creating an example2 record requires a valid gender', function () {
    $actor = User::factory()->create();

    $this->actingAs($actor)
        ->from(route('example2.index'))
        ->post(route('example2.store'), validExampleRecordPayload([
            'gender' => 'invalid',
        ]))
        ->assertSessionHasErrors('gender')
        ->assertRedirect(route('example2.index'));
});

test('an example2 record can be updated', function () {
    $actor = User::factory()->create();
    $record = Example2::factory()->create([
        'name' => 'Before Update',
        'email' => 'before@example.com',
    ]);

    $this->actingAs($actor)
        ->put(route('example2.update', $record), validExampleRecordPayload([
            'name' => 'After Update',
            'email' => 'after@example.com',
            'department' => 'Marketing',
        ]))
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('example2.index'));

    $record->refresh();

    expect($record->name)->toBe('After Update')
        ->and($record->email)->toBe('after@example.com')
        ->and($record->department)->toBe('Marketing');
});

test('updating an example2 record ignores its own unique email', function () {
    $actor = User::factory()->create();
    $record = Example2::factory()->create([
        'email' => 'same@example.com',
    ]);

    $this->actingAs($actor)
        ->put(route('example2.update', $record), validExampleRecordPayload([
            'email' => 'same@example.com',
        ]))
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('example2.index'));
});

test('an example2 record can be deleted', function () {
    $actor = User::factory()->create();
    $record = Example2::factory()->create();

    $this->actingAs($actor)
        ->delete(route('example2.destroy', $record))
        ->assertRedirect(route('example2.index'));

    expect($record->fresh())->toBeNull();
});
