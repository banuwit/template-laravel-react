<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;

test('guests cannot open the add new user page', function () {
    $this->get(route('users.create'))
        ->assertRedirect(route('login'));
});

test('authenticated users can open the add new user page', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('users.create'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('users/create')
            ->has('passwordRules'),
        );
});

test('a user can be created', function () {
    $actor = User::factory()->create();

    $this->actingAs($actor)
        ->post(route('users.store'), validUserPayload([
            'name' => 'New User',
            'email' => 'new@example.com',
        ]))
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('users.index'));

    $created = User::query()->where('email', 'new@example.com')->first();

    expect($created)->not->toBeNull()
        ->and($created?->name)->toBe('New User')
        ->and($created?->phone)->toBe('+1 555-0100')
        ->and($created?->department)->toBe('Engineering')
        ->and($created?->gender->value)->toBe('male')
        ->and(Hash::check('password', $created?->password))->toBeTrue();
});

test('creating a user requires a unique email', function () {
    $actor = User::factory()->create([
        'email' => 'taken@example.com',
    ]);

    $this->actingAs($actor)
        ->from(route('users.create'))
        ->post(route('users.store'), validUserPayload([
            'name' => 'Duplicate',
            'email' => 'taken@example.com',
        ]))
        ->assertSessionHasErrors('email')
        ->assertRedirect(route('users.create'));
});

test('guests cannot open the user detail page', function () {
    $user = User::factory()->create();

    $this->get(route('users.show', $user))
        ->assertRedirect(route('login'));
});

test('authenticated users can open the user detail page', function () {
    $actor = User::factory()->create();
    $user = User::factory()->create([
        'name' => 'Alice Johnson',
        'email' => 'alice@example.com',
    ]);

    $this->actingAs($actor)
        ->get(route('users.show', $user))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('users/show')
            ->where('user.id', $user->id)
            ->where('user.name', 'Alice Johnson')
            ->where('user.email', 'alice@example.com')
            ->where('user.can_update', true)
            ->where('user.can_delete', true)
            ->missing('user.password'),
        );
});

test('a user cannot delete themselves from their detail page', function () {
    $actor = User::factory()->create();

    $this->actingAs($actor)
        ->get(route('users.show', $actor))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('users/show')
            ->where('user.id', $actor->id)
            ->where('user.can_delete', false),
        );
});

test('authenticated users can open the edit user page', function () {
    $actor = User::factory()->create();
    $user = User::factory()->create([
        'name' => 'Alice Johnson',
        'email' => 'alice@example.com',
    ]);

    $this->actingAs($actor)
        ->get(route('users.edit', $user))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('users/edit')
            ->where('user.id', $user->id)
            ->where('user.name', 'Alice Johnson')
            ->where('user.email', 'alice@example.com')
            ->missing('user.password')
            ->has('passwordRules'),
        );
});

test('a user can be updated without changing the password', function () {
    $actor = User::factory()->create();
    $user = User::factory()->create([
        'name' => 'Old Name',
        'email' => 'old@example.com',
        'password' => 'password',
    ]);

    $this->actingAs($actor)
        ->put(route('users.update', $user), validExampleRecordPayload([
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
        ]))
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('users.index'));

    $user->refresh();

    expect($user->name)->toBe('Updated Name')
        ->and($user->email)->toBe('updated@example.com')
        ->and($user->email_verified_at)->toBeNull()
        ->and(Hash::check('password', $user->password))->toBeTrue();
});

test('a user password can be updated', function () {
    $actor = User::factory()->create();
    $user = User::factory()->create([
        'password' => 'password',
    ]);

    $this->actingAs($actor)
        ->put(route('users.update', $user), validExampleRecordPayload([
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'department' => $user->department,
            'position' => $user->position,
            'join_date' => $user->join_date?->toDateString(),
            'gender' => $user->gender?->value,
            'status' => $user->status->value,
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ]))
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('users.index'));

    expect(Hash::check('new-password', $user->refresh()->password))->toBeTrue();
});

test('a user can be deleted', function () {
    $actor = User::factory()->create();
    $user = User::factory()->create();

    $this->actingAs($actor)
        ->delete(route('users.destroy', $user))
        ->assertRedirect(route('users.index'));

    expect($user->fresh())->toBeNull();
    $this->assertModelExists($actor);
});

test('a user cannot delete their own account from the user list', function () {
    $actor = User::factory()->create();

    $this->actingAs($actor)
        ->delete(route('users.destroy', $actor))
        ->assertForbidden();

    $this->assertModelExists($actor);
});
