<?php

use App\Enums\MenuLayout;
use App\Models\Menu;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function () {
    $this->get(route('menus.index'))
        ->assertRedirect(route('login'));
});

test('authenticated users can visit the menus list', function () {
    $user = User::factory()->create();
    $first = Menu::factory()->create(['name' => 'First', 'sort_order' => 1]);
    $second = Menu::factory()->create(['name' => 'Second', 'sort_order' => 2]);

    $this->actingAs($user)
        ->get(route('menus.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('menus/index')
            ->has('menus.data', 2)
            ->where('menus.data.0.id', $first->id)
            ->where('menus.data.0.can_delete', true)
            ->where('menus.data.1.id', $second->id)
            ->where('filters.sort', 'sort_order')
            ->where('filters.direction', 'asc'),
        );
});

test('menus can be searched by name or slug', function () {
    $user = User::factory()->create();
    Menu::factory()->create(['name' => 'Dashboard', 'slug' => 'dashboard']);
    Menu::factory()->create(['name' => 'Reports', 'slug' => 'reports']);

    $this->actingAs($user)
        ->get(route('menus.index', ['search' => 'Dashboard']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('menus/index')
            ->has('menus.data', 1)
            ->where('menus.data.0.name', 'Dashboard'),
        );
});

test('menus can be filtered by layout', function () {
    $user = User::factory()->create();
    Menu::factory()->create(['name' => 'Sidebar Item', 'layout' => MenuLayout::Sidebar]);
    Menu::factory()->create(['name' => 'Topbar Item', 'layout' => MenuLayout::Topbar]);

    $this->actingAs($user)
        ->get(route('menus.index', ['layout' => ['topbar']]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('menus/index')
            ->has('menus.data', 1)
            ->where('menus.data.0.name', 'Topbar Item'),
        );
});

test('menus can be sorted by name', function () {
    $user = User::factory()->create();
    Menu::factory()->create(['name' => 'Zeta']);
    Menu::factory()->create(['name' => 'Alpha']);

    $this->actingAs($user)
        ->get(route('menus.index', ['sort' => 'name', 'direction' => 'asc']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('menus/index')
            ->where('menus.data.0.name', 'Alpha')
            ->where('menus.data.1.name', 'Zeta'),
        );
});

test('menus list is paginated', function () {
    $user = User::factory()->create();
    Menu::factory()->count(11)->create();

    $this->actingAs($user)
        ->get(route('menus.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('menus/index')
            ->has('menus.data', 10)
            ->where('menus.total', 11)
            ->where('menus.last_page', 2)
            ->where('menus.current_page', 1),
        );
});

test('invalid sort columns are rejected', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->from(route('menus.index'))
        ->get(route('menus.index', ['sort' => 'id']))
        ->assertRedirect(route('menus.index'))
        ->assertSessionHasErrors('sort');
});
