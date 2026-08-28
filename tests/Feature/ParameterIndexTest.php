<?php

use App\Models\Parameter;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function () {
    $this->get(route('parameters.index'))
        ->assertRedirect(route('login'));
});

test('authenticated users can visit the parameter list', function () {
    $user = User::factory()->create();

    $first = Parameter::factory()->create([
        'created_at' => now()->subMinute(),
    ]);
    $second = Parameter::factory()->create([
        'created_at' => now(),
    ]);

    $this->actingAs($user)
        ->get(route('parameters.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('parameters/index')
            ->has('parameters.data', 2)
            ->where('parameters.data.0.id', $second->id)
            ->where('parameters.data.1.id', $first->id)
            ->where('filters.sort', 'created_at')
            ->where('filters.direction', 'desc'),
        );
});

test('parameters can be searched by group, code, or value', function () {
    $user = User::factory()->create();

    Parameter::factory()->create([
        'group' => 'status',
        'code' => 'status_active',
        'value' => 'Enabled',
    ]);

    Parameter::factory()->create([
        'group' => 'status',
        'code' => 'status_inactive',
        'value' => 'Disabled',
    ]);

    Parameter::factory()->create([
        'group' => 'gender',
        'code' => 'gender_male',
        'value' => 'Male',
    ]);

    $this->actingAs($user)
        ->get(route('parameters.index', ['search' => 'Enabled']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('parameters/index')
            ->has('parameters.data', 1)
            ->where('parameters.data.0.code', 'status_active')
            ->where('filters.search', 'Enabled'),
        );
});

test('parameters can be sorted by code', function () {
    $user = User::factory()->create();

    Parameter::factory()->create(['code' => 'charlie']);
    Parameter::factory()->create(['code' => 'alice']);
    Parameter::factory()->create(['code' => 'bob']);

    $this->actingAs($user)
        ->get(route('parameters.index', ['sort' => 'code', 'direction' => 'asc']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('parameters/index')
            ->where('parameters.data.0.code', 'alice')
            ->where('parameters.data.1.code', 'bob')
            ->where('parameters.data.2.code', 'charlie')
            ->where('filters.sort', 'code')
            ->where('filters.direction', 'asc'),
        );
});

test('the parameter list is paginated', function () {
    $user = User::factory()->create();
    Parameter::factory()->count(11)->create();

    $this->actingAs($user)
        ->get(route('parameters.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('parameters/index')
            ->has('parameters.data', 10)
            ->where('parameters.total', 11)
            ->where('parameters.last_page', 2)
            ->where('parameters.current_page', 1),
        );
});

test('invalid sort columns are rejected', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->from(route('parameters.index'))
        ->get(route('parameters.index', ['sort' => 'description']))
        ->assertRedirect(route('parameters.index'))
        ->assertSessionHasErrors('sort');
});
