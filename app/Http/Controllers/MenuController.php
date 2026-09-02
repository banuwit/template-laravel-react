<?php

namespace App\Http\Controllers;

use App\Http\Requests\Menus\IndexMenuRequest;
use App\Http\Requests\Menus\StoreMenuRequest;
use App\Http\Requests\Menus\UpdateMenuRequest;
use App\Models\Menu;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class MenuController extends Controller
{
    public function index(IndexMenuRequest $request): Response
    {
        $actor = $request->user();

        $menus = Menu::query()
            ->select(['id', 'name', 'slug', 'icon', 'route_name', 'route_pattern', 'parent_id', 'level', 'sort_order', 'layout', 'is_active', 'created_at', 'updated_at'])
            ->with('parent:id,name')
            ->search($request->search())
            ->when($request->layouts(), fn ($query, array $layouts) => $query->whereIn('layout', $layouts))
            ->when($request->activeStates(), fn ($query, array $states) => $query->whereIn('is_active', $states))
            ->orderBy($request->sort(), $request->direction())
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Menu $record): array => $this->transformRecord($record, $actor));

        return Inertia::render('menus/index', [
            'menus' => $menus,
            'filters' => [
                'search' => $request->search() ?? '',
                'sort' => $request->sort(),
                'direction' => $request->direction(),
                'layout' => $request->layouts(),
                'is_active' => $request->activeFilter(),
            ],
            'parentOptions' => Menu::query()
                ->orderBy('name')
                ->get(['id', 'name'])
                ->map(fn (Menu $menu): array => [
                    'value' => (string) $menu->id,
                    'label' => $menu->name,
                ]),
        ]);
    }

    public function store(StoreMenuRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['level'] = $this->levelFor($data['parent_id'] ?? null);

        Menu::create($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Menu created.')]);

        return to_route('menus.index');
    }

    public function update(UpdateMenuRequest $request, Menu $menu): RedirectResponse
    {
        $data = $request->validated();
        $data['level'] = $this->levelFor($data['parent_id'] ?? null);

        $menu->update($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Menu updated.')]);

        return to_route('menus.index');
    }

    public function destroy(Menu $menu): RedirectResponse
    {
        Gate::authorize('delete', $menu);

        $menu->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Menu deleted.')]);

        return to_route('menus.index');
    }

    private function levelFor(?int $parentId): int
    {
        if ($parentId === null) {
            return 0;
        }

        $parent = Menu::query()->find($parentId);

        return $parent === null ? 0 : $parent->level + 1;
    }

    /**
     * @return array<string, mixed>
     */
    private function transformRecord(Menu $record, ?User $actor): array
    {
        return [
            'id' => $record->id,
            'name' => $record->name,
            'slug' => $record->slug,
            'icon' => $record->icon,
            'route_name' => $record->route_name,
            'route_pattern' => $record->route_pattern,
            'parent_id' => $record->parent_id,
            'parent_name' => $record->parent?->name,
            'level' => $record->level,
            'sort_order' => $record->sort_order,
            'layout' => $record->layout->value,
            'is_active' => $record->is_active,
            'created_at' => $record->created_at?->toIso8601String(),
            'updated_at' => $record->updated_at?->toIso8601String(),
            'can_delete' => $actor !== null && $actor->can('delete', $record),
        ];
    }
}
