<?php

use App\Models\Example1;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests cannot open the add new example1 page', function () {
    $this->get(route('example1.create'))
        ->assertRedirect(route('login'));
});

test('authenticated users can open the add new example1 page', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('example1.create'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('example1/create'),
        );
});

test('guests cannot create an example1 record', function () {
    $this->post(route('example1.store'), validExampleRecordPayload())
        ->assertRedirect(route('login'));
});

test('an example1 record can be created', function () {
    $actor = User::factory()->create();

    $this->actingAs($actor)
        ->post(route('example1.store'), validExampleRecordPayload([
            'email' => 'new.hire@example.com',
        ]))
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('example1.index'));

    $created = Example1::query()->where('email', 'new.hire@example.com')->first();

    expect($created)->not->toBeNull()
        ->and($created?->name)->toBe('Alex Rivera')
        ->and($created?->department)->toBe('Engineering')
        ->and($created?->gender->value)->toBe('male');
});

test('creating an example1 record requires a unique email', function () {
    $actor = User::factory()->create();
    Example1::factory()->create(['email' => 'taken@example.com']);

    $this->actingAs($actor)
        ->from(route('example1.create'))
        ->post(route('example1.store'), validExampleRecordPayload([
            'email' => 'taken@example.com',
        ]))
        ->assertSessionHasErrors('email')
        ->assertRedirect(route('example1.create'));
});

test('creating an example1 record requires a valid gender', function () {
    $actor = User::factory()->create();

    $this->actingAs($actor)
        ->from(route('example1.create'))
        ->post(route('example1.store'), validExampleRecordPayload([
            'gender' => 'invalid',
        ]))
        ->assertSessionHasErrors('gender')
        ->assertRedirect(route('example1.create'));
});

test('guests cannot open the example1 detail page', function () {
    $record = Example1::factory()->create();

    $this->get(route('example1.show', $record))
        ->assertRedirect(route('login'));
});

test('authenticated users can open the example1 detail page', function () {
    $actor = User::factory()->create();
    $record = Example1::factory()->create([
        'name' => 'Alice Johnson',
        'email' => 'alice@example.com',
    ]);

    $this->actingAs($actor)
        ->get(route('example1.show', $record))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('example1/show')
            ->where('example1.id', $record->id)
            ->where('example1.name', 'Alice Johnson')
            ->where('example1.email', 'alice@example.com')
            ->where('example1.can_delete', true)
            ->where('example1.can_update', true),
        );
});

test('guests cannot open the example1 edit page', function () {
    $record = Example1::factory()->create();

    $this->get(route('example1.edit', $record))
        ->assertRedirect(route('login'));
});

test('authenticated users can open the example1 edit page', function () {
    $actor = User::factory()->create();
    $record = Example1::factory()->create([
        'name' => 'Bob Smith',
        'email' => 'bob@example.com',
    ]);

    $this->actingAs($actor)
        ->get(route('example1.edit', $record))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('example1/edit')
            ->where('example1.id', $record->id)
            ->where('example1.name', 'Bob Smith')
            ->where('example1.email', 'bob@example.com'),
        );
});

test('an example1 record can be updated', function () {
    $actor = User::factory()->create();
    $record = Example1::factory()->create([
        'name' => 'Before Update',
        'email' => 'before@example.com',
    ]);

    $this->actingAs($actor)
        ->put(route('example1.update', $record), validExampleRecordPayload([
            'name' => 'After Update',
            'email' => 'after@example.com',
            'department' => 'Marketing',
        ]))
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('example1.index'));

    $record->refresh();

    expect($record->name)->toBe('After Update')
        ->and($record->email)->toBe('after@example.com')
        ->and($record->department)->toBe('Marketing');
});

test('updating an example1 record ignores its own unique email', function () {
    $actor = User::factory()->create();
    $record = Example1::factory()->create([
        'email' => 'same@example.com',
    ]);

    $this->actingAs($actor)
        ->put(route('example1.update', $record), validExampleRecordPayload([
            'email' => 'same@example.com',
        ]))
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('example1.index'));
});

test('an example1 record can be deleted', function () {
    $actor = User::factory()->create();
    $record = Example1::factory()->create();

    $this->actingAs($actor)
        ->delete(route('example1.destroy', $record))
        ->assertRedirect(route('example1.index'));

    expect($record->fresh())->toBeNull();
});
