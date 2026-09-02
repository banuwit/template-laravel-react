<?php

use App\Models\Parameter;
use App\Models\User;
use Illuminate\Support\Facades\Route;

test('create, show, and edit parameters pages are not registered', function () {
    expect(Route::has('parameters.create'))->toBeFalse()
        ->and(Route::has('parameters.show'))->toBeFalse()
        ->and(Route::has('parameters.edit'))->toBeFalse();
});

test('guests cannot create parameters', function () {
    $this->post(route('parameters.store'), [
        'group' => 'status',
        'code' => 'status_active',
        'value' => 'Active',
    ])->assertRedirect(route('login'));
});

test('authenticated users can create a parameter', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('parameters.store'), [
            'group' => 'status',
            'code' => 'status_active',
            'value' => 'Active',
            'description' => 'Record is available for use.',
            'text_color' => '#166534',
            'bg_color' => '#dcfce7',
            'sort_order' => 1,
            'is_active' => '1',
        ])
        ->assertRedirect(route('parameters.index'));

    $parameter = Parameter::query()->where('code', 'status_active')->firstOrFail();

    expect($parameter->group)->toBe('status')
        ->and($parameter->value)->toBe('Active')
        ->and($parameter->is_active)->toBeTrue()
        ->and($parameter->is_system)->toBeFalse()
        ->and($parameter->created_by)->toBe($user->id)
        ->and($parameter->updated_by)->toBe($user->id);
});

test('creating a parameter fails when the code is already taken', function () {
    $user = User::factory()->create();
    Parameter::factory()->create(['code' => 'status_active']);

    $this->actingAs($user)
        ->post(route('parameters.store'), [
            'group' => 'status',
            'code' => 'status_active',
            'value' => 'Active',
            'sort_order' => 1,
            'is_active' => '1',
        ])
        ->assertSessionHasErrors('code');
});

test('creating a parameter fails when the color format is invalid', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('parameters.store'), [
            'group' => 'status',
            'code' => 'status_active',
            'value' => 'Active',
            'text_color' => 'not-a-color',
            'sort_order' => 1,
            'is_active' => '1',
        ])
        ->assertSessionHasErrors('text_color');
});

test('authenticated users can update a parameter', function () {
    $user = User::factory()->create();
    $parameter = Parameter::factory()->create(['value' => 'Old value']);

    $this->actingAs($user)
        ->put(route('parameters.update', $parameter), [
            'group' => $parameter->group,
            'code' => $parameter->code,
            'value' => 'New value',
            'sort_order' => $parameter->sort_order,
            'is_active' => '1',
        ])
        ->assertRedirect(route('parameters.index'));

    expect($parameter->fresh()->value)->toBe('New value')
        ->and($parameter->fresh()->updated_by)->toBe($user->id);
});

test('updating a parameter ignores its own code for the unique rule', function () {
    $user = User::factory()->create();
    $parameter = Parameter::factory()->create(['code' => 'status_active']);

    $this->actingAs($user)
        ->put(route('parameters.update', $parameter), [
            'group' => $parameter->group,
            'code' => 'status_active',
            'value' => $parameter->value,
            'sort_order' => $parameter->sort_order,
            'is_active' => '1',
        ])
        ->assertSessionHasNoErrors();
});

test('authenticated users can delete a non-system parameter', function () {
    $user = User::factory()->create();
    $parameter = Parameter::factory()->create();

    $this->actingAs($user)
        ->delete(route('parameters.destroy', $parameter))
        ->assertRedirect(route('parameters.index'));

    expect(Parameter::find($parameter->id))->toBeNull()
        ->and(Parameter::withTrashed()->find($parameter->id)->trashed())->toBeTrue()
        ->and(Parameter::withTrashed()->find($parameter->id)->deleted_by)->toBe($user->id);
});

test('system parameters cannot be deleted', function () {
    $user = User::factory()->create();
    $parameter = Parameter::factory()->system()->create();

    $this->actingAs($user)
        ->delete(route('parameters.destroy', $parameter))
        ->assertForbidden();

    expect(Parameter::find($parameter->id))->not->toBeNull();
});
