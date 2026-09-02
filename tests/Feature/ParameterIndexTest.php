<?php

use App\Models\Parameter;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function () {
    $this->get(route('parameters.index'))
        ->assertRedirect(route('login'));
});

test('authenticated users can visit the parameters list', function () {
    $user = User::factory()->create();
    $first = Parameter::factory()->create(['sort_order' => 1, 'code' => 'a_code']);
    $second = Parameter::factory()->create(['sort_order' => 2, 'code' => 'b_code']);

    $this->actingAs($user)
        ->get(route('parameters.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('parameters/index')
            ->has('parameters', 2)
            ->where('parameters.0.id', $first->id)
            ->where('parameters.0.can_delete', true)
            ->where('parameters.1.id', $second->id),
        );
});

test('the full parameter list is sent without pagination', function () {
    $user = User::factory()->create();
    Parameter::factory()->count(15)->create();

    $this->actingAs($user)
        ->get(route('parameters.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('parameters/index')
            ->has('parameters', 15),
        );
});

test('parameters are ordered by sort order then code', function () {
    $user = User::factory()->create();
    Parameter::factory()->create(['sort_order' => 1, 'code' => 'b_code']);
    Parameter::factory()->create(['sort_order' => 1, 'code' => 'a_code']);
    Parameter::factory()->create(['sort_order' => 0, 'code' => 'c_code']);

    $this->actingAs($user)
        ->get(route('parameters.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('parameters/index')
            ->where('parameters.0.code', 'c_code')
            ->where('parameters.1.code', 'a_code')
            ->where('parameters.2.code', 'b_code'),
        );
});

test('system parameters cannot be deleted from the list', function () {
    $user = User::factory()->create();
    $parameter = Parameter::factory()->system()->create();

    $this->actingAs($user)
        ->get(route('parameters.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('parameters/index')
            ->where('parameters.0.can_delete', false),
        );

    expect($parameter->is_system)->toBeTrue();
});
