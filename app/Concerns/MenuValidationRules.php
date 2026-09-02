<?php

namespace App\Concerns;

use App\Enums\MenuLayout;
use App\Models\Menu;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;

trait MenuValidationRules
{
    /**
     * @return array<string, array<int, ValidationRule|array<mixed>|Closure|string>>
     */
    protected function menuRules(?int $menuId = null): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => [
                'required',
                'string',
                'max:255',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                $menuId === null
                    ? Rule::unique(Menu::class)
                    : Rule::unique(Menu::class)->ignore($menuId),
            ],
            'icon' => ['nullable', 'string', 'max:100'],
            'route_name' => ['nullable', 'string', 'max:255'],
            'route_pattern' => ['nullable', 'string', 'max:255'],
            'parent_id' => [
                'nullable',
                'integer',
                Rule::exists(Menu::class, 'id'),
                function (string $attribute, mixed $value, Closure $fail) use ($menuId): void {
                    if ($menuId !== null && (int) $value === $menuId) {
                        $fail('A menu cannot be its own parent.');
                    }
                },
            ],
            'sort_order' => ['required', 'integer', 'min:0'],
            'layout' => ['required', new Enum(MenuLayout::class)],
            'is_active' => ['required', 'boolean'],
        ];
    }
}
