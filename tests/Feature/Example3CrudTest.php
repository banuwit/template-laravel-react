<?php

use App\Models\Example3;
use App\Models\User;
use Illuminate\Support\Facades\Route;

test('create, show, and edit example3 pages are not registered', function () {
    expect(Route::has('example3.create'))->toBeFalse()
        ->and(Route::has('example3.show'))->toBeFalse()
        ->and(Route::has('example3.edit'))->toBeFalse();
});

test('guests cannot create an example3 record', function () {
    $this->post(route('example3.store'), validExampleRecordPayload())
        ->assertRedirect(route('login'));
});

test('an example3 record can be created', function () {
    $actor = User::factory()->create();

    $this->actingAs($actor)
        ->post(route('example3.store'), validExampleRecordPayload([
            'email' => 'new.hire@example.com',
        ]))
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('example3.index'));

    $created = Example3::query()->where('email', 'new.hire@example.com')->first();

    expect($created)->not->toBeNull()
        ->and($created?->name)->toBe('Alex Rivera')
        ->and($created?->department)->toBe('Engineering')
        ->and($created?->gender->value)->toBe('male');
});

test('creating an example3 record requires a unique email', function () {
    $actor = User::factory()->create();
    Example3::factory()->create(['email' => 'taken@example.com']);

    $this->actingAs($actor)
        ->from(route('example3.index'))
        ->post(route('example3.store'), validExampleRecordPayload([
            'email' => 'taken@example.com',
        ]))
        ->assertSessionHasErrors('email')
        ->assertRedirect(route('example3.index'));
});

test('creating an example3 record requires a valid gender', function () {
    $actor = User::factory()->create();

    $this->actingAs($actor)
        ->from(route('example3.index'))
        ->post(route('example3.store'), validExampleRecordPayload([
            'gender' => 'invalid',
        ]))
        ->assertSessionHasErrors('gender')
        ->assertRedirect(route('example3.index'));
});

test('an example3 record can be updated', function () {
    $actor = User::factory()->create();
    $record = Example3::factory()->create([
        'name' => 'Before Update',
        'email' => 'before@example.com',
    ]);

    $this->actingAs($actor)
        ->put(route('example3.update', $record), validExampleRecordPayload([
            'name' => 'After Update',
            'email' => 'after@example.com',
            'department' => 'Marketing',
        ]))
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('example3.index'));

    $record->refresh();

    expect($record->name)->toBe('After Update')
        ->and($record->email)->toBe('after@example.com')
        ->and($record->department)->toBe('Marketing');
});

test('updating an example3 record ignores its own unique email', function () {
    $actor = User::factory()->create();
    $record = Example3::factory()->create([
        'email' => 'same@example.com',
    ]);

    $this->actingAs($actor)
        ->put(route('example3.update', $record), validExampleRecordPayload([
            'email' => 'same@example.com',
        ]))
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('example3.index'));
});

test('an example3 record can be deleted', function () {
    $actor = User::factory()->create();
    $record = Example3::factory()->create();

    $this->actingAs($actor)
        ->delete(route('example3.destroy', $record))
        ->assertRedirect(route('example3.index'));

    expect($record->fresh())->toBeNull();
});
