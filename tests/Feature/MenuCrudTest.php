<?php

use App\Models\Menu;
use App\Models\User;
use Illuminate\Support\Facades\Route;

function menuPayload(array $overrides = []): array
{
    return array_merge([
        'name' => 'Dashboard',
        'slug' => 'dashboard',
        'icon' => null,
        'route_name' => null,
        'route_pattern' => null,
        'parent_id' => null,
        'sort_order' => 0,
        'layout' => 'sidebar',
        'is_active' => true,
    ], $overrides);
}

test('create, show, and edit menu pages are not registered', function () {
    expect(Route::has('menus.create'))->toBeFalse()
        ->and(Route::has('menus.show'))->toBeFalse()
        ->and(Route::has('menus.edit'))->toBeFalse();
});

test('guests cannot create a menu', function () {
    $this->post(route('menus.store'), menuPayload())
        ->assertRedirect(route('login'));
});

test('a menu can be created', function () {
    $actor = User::factory()->create();

    $this->actingAs($actor)
        ->post(route('menus.store'), menuPayload())
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('menus.index'));

    $created = Menu::query()->where('slug', 'dashboard')->first();

    expect($created)->not->toBeNull()
        ->and($created?->level)->toBe(0)
        ->and($created?->created_by)->toBe($actor->id)
        ->and($created?->updated_by)->toBe($actor->id);
});

test('a child menu inherits its parent level plus one', function () {
    $actor = User::factory()->create();
    $parent = Menu::factory()->create(['level' => 0]);

    $this->actingAs($actor)
        ->post(route('menus.store'), menuPayload([
            'slug' => 'child-menu',
            'parent_id' => $parent->id,
        ]))
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('menus.index'));

    $created = Menu::query()->where('slug', 'child-menu')->first();

    expect($created?->level)->toBe($parent->level + 1)
        ->and($created?->parent_id)->toBe($parent->id);
});

test('creating a menu requires a unique slug', function () {
    $actor = User::factory()->create();
    Menu::factory()->create(['slug' => 'dashboard']);

    $this->actingAs($actor)
        ->from(route('menus.index'))
        ->post(route('menus.store'), menuPayload())
        ->assertSessionHasErrors('slug')
        ->assertRedirect(route('menus.index'));
});

test('creating a menu rejects an invalid slug format', function () {
    $actor = User::factory()->create();

    $this->actingAs($actor)
        ->from(route('menus.index'))
        ->post(route('menus.store'), menuPayload(['slug' => 'Not A Slug']))
        ->assertSessionHasErrors('slug')
        ->assertRedirect(route('menus.index'));
});

test('creating a menu requires an existing parent', function () {
    $actor = User::factory()->create();

    $this->actingAs($actor)
        ->from(route('menus.index'))
        ->post(route('menus.store'), menuPayload(['parent_id' => 999999]))
        ->assertSessionHasErrors('parent_id')
        ->assertRedirect(route('menus.index'));
});

test('a menu can be updated', function () {
    $actor = User::factory()->create();
    $menu = Menu::factory()->create(['name' => 'Before Update', 'slug' => 'before-update']);

    $this->actingAs($actor)
        ->put(route('menus.update', $menu), menuPayload(['name' => 'After Update', 'slug' => 'before-update']))
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('menus.index'));

    $menu->refresh();

    expect($menu->name)->toBe('After Update')
        ->and($menu->updated_by)->toBe($actor->id);
});

test('updating a menu ignores its own unique slug', function () {
    $actor = User::factory()->create();
    $menu = Menu::factory()->create(['slug' => 'dashboard']);

    $this->actingAs($actor)
        ->put(route('menus.update', $menu), menuPayload(['slug' => 'dashboard']))
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('menus.index'));
});

test('a menu cannot be set as its own parent', function () {
    $actor = User::factory()->create();
    $menu = Menu::factory()->create(['slug' => 'dashboard']);

    $this->actingAs($actor)
        ->from(route('menus.index'))
        ->put(route('menus.update', $menu), menuPayload(['slug' => 'dashboard', 'parent_id' => $menu->id]))
        ->assertSessionHasErrors('parent_id')
        ->assertRedirect(route('menus.index'));
});

test('a menu can be deleted', function () {
    $actor = User::factory()->create();
    $menu = Menu::factory()->create();

    $this->actingAs($actor)
        ->delete(route('menus.destroy', $menu))
        ->assertRedirect(route('menus.index'));

    expect(Menu::query()->find($menu->id))->toBeNull();

    $trashed = Menu::withTrashed()->find($menu->id);

    expect($trashed?->trashed())->toBeTrue()
        ->and($trashed?->deleted_by)->toBe($actor->id);
});
