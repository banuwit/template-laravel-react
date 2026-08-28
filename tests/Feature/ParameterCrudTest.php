<?php

use App\Models\Parameter;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests cannot open the add new parameter page', function () {
    $this->get(route('parameters.create'))
        ->assertRedirect(route('login'));
});

test('authenticated users can open the add new parameter page', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('parameters.create'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('parameters/create'),
        );
});

test('a parameter can be created and records the creating actor', function () {
    $actor = User::factory()->create();

    $this->actingAs($actor)
        ->post(route('parameters.store'), [
            'group' => 'status',
            'code' => 'status_active',
            'value' => 'Active',
            'description' => 'Active status',
            'text_color' => '#111827',
            'bg_color' => '#E5E7EB',
            'is_active' => '1',
            'is_system' => '0',
            'sort_order' => 1,
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('parameters.index'));

    $created = Parameter::query()->where('code', 'status_active')->first();

    expect($created)->not->toBeNull()
        ->and($created?->value)->toBe('Active')
        ->and($created?->is_active)->toBeTrue()
        ->and($created?->is_system)->toBeFalse()
        ->and($created?->created_by)->toBe($actor->id)
        ->and($created?->updated_by)->toBe($actor->id);
});

test('creating a parameter requires a unique code', function () {
    $actor = User::factory()->create();
    Parameter::factory()->create(['code' => 'status_active']);

    $this->actingAs($actor)
        ->from(route('parameters.create'))
        ->post(route('parameters.store'), [
            'group' => 'status',
            'code' => 'status_active',
            'value' => 'Duplicate',
            'is_active' => '1',
            'is_system' => '0',
            'sort_order' => 0,
        ])
        ->assertSessionHasErrors('code')
        ->assertRedirect(route('parameters.create'));
});

test('guests cannot open the parameter detail page', function () {
    $parameter = Parameter::factory()->create();

    $this->get(route('parameters.show', $parameter))
        ->assertRedirect(route('login'));
});

test('authenticated users can open the parameter detail page', function () {
    $actor = User::factory()->create();
    $parameter = Parameter::factory()->create([
        'code' => 'status_active',
        'value' => 'Active',
    ]);

    $this->actingAs($actor)
        ->get(route('parameters.show', $parameter))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('parameters/show')
            ->where('parameter.id', $parameter->id)
            ->where('parameter.code', 'status_active')
            ->where('parameter.value', 'Active')
            ->where('parameter.can_update', true)
            ->where('parameter.can_delete', true),
        );
});

test('a system parameter cannot be deleted', function () {
    $actor = User::factory()->create();
    $parameter = Parameter::factory()->create(['is_system' => true]);

    $this->actingAs($actor)
        ->get(route('parameters.show', $parameter))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('parameters/show')
            ->where('parameter.can_delete', false),
        );

    $this->actingAs($actor)
        ->delete(route('parameters.destroy', $parameter))
        ->assertForbidden();

    $this->assertModelExists($parameter);
});

test('authenticated users can open the edit parameter page', function () {
    $actor = User::factory()->create();
    $parameter = Parameter::factory()->create([
        'code' => 'status_active',
        'value' => 'Active',
    ]);

    $this->actingAs($actor)
        ->get(route('parameters.edit', $parameter))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('parameters/edit')
            ->where('parameter.id', $parameter->id)
            ->where('parameter.code', 'status_active')
            ->where('parameter.value', 'Active'),
        );
});

test('a parameter can be updated and records the updating actor', function () {
    $actor = User::factory()->create();
    $parameter = Parameter::factory()->create([
        'group' => 'status',
        'code' => 'status_active',
        'value' => 'Active',
    ]);

    $this->actingAs($actor)
        ->put(route('parameters.update', $parameter), [
            'group' => 'status',
            'code' => 'status_active',
            'value' => 'Updated value',
            'is_active' => '1',
            'is_system' => '0',
            'sort_order' => 5,
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('parameters.index'));

    $parameter->refresh();

    expect($parameter->value)->toBe('Updated value')
        ->and($parameter->sort_order)->toBe(5)
        ->and($parameter->updated_by)->toBe($actor->id);
});

test('a parameter can be deleted and records the deleting actor', function () {
    $actor = User::factory()->create();
    $parameter = Parameter::factory()->create();

    $this->actingAs($actor)
        ->delete(route('parameters.destroy', $parameter))
        ->assertRedirect(route('parameters.index'));

    expect(Parameter::find($parameter->id))->toBeNull();

    $trashed = Parameter::withTrashed()->find($parameter->id);

    expect($trashed)->not->toBeNull()
        ->and($trashed->deleted_by)->toBe($actor->id)
        ->and($trashed->trashed())->toBeTrue();
});
