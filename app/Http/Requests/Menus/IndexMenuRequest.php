<?php

namespace App\Http\Requests\Menus;

use App\Enums\MenuLayout;
use App\Models\Menu;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class IndexMenuRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('viewAny', Menu::class) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'search' => ['nullable', 'string', 'max:255'],
            'sort' => ['nullable', 'in:name,slug,layout,sort_order,created_at'],
            'direction' => ['nullable', 'in:asc,desc'],
            'layout' => ['nullable', 'array'],
            'layout.*' => [new Enum(MenuLayout::class)],
            'is_active' => ['nullable', 'array'],
            'is_active.*' => ['in:0,1'],
        ];
    }

    public function search(): ?string
    {
        $search = $this->validated('search');

        return is_string($search) && $search !== '' ? $search : null;
    }

    /**
     * @return 'name'|'slug'|'layout'|'sort_order'|'created_at'
     */
    public function sort(): string
    {
        $sort = $this->validated('sort');

        return in_array($sort, ['name', 'slug', 'layout', 'sort_order', 'created_at'], true)
            ? $sort
            : 'sort_order';
    }

    /**
     * @return 'asc'|'desc'
     */
    public function direction(): string
    {
        $direction = $this->validated('direction');

        return $direction === 'desc' ? 'desc' : 'asc';
    }

    /**
     * @return array<int, string>
     */
    public function layouts(): array
    {
        return $this->validated('layout') ?? [];
    }

    /**
     * @return array<int, string>
     */
    public function activeFilter(): array
    {
        return $this->validated('is_active') ?? [];
    }

    /**
     * @return array<int, bool>
     */
    public function activeStates(): array
    {
        return array_map(fn (string $value): bool => $value === '1', $this->activeFilter());
    }
}
