<?php

namespace App\Http\Requests\Menus;

use App\Concerns\MenuValidationRules;
use App\Models\Menu;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateMenuRequest extends FormRequest
{
    use MenuValidationRules;

    public function authorize(): bool
    {
        $menu = $this->route('menu');

        return $menu instanceof Menu
            && ($this->user()?->can('update', $menu) ?? false);
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $menu = $this->route('menu');

        return $this->menuRules(
            $menu instanceof Menu ? $menu->id : null,
        );
    }
}
