<?php

namespace App\Http\Requests\Menus;

use App\Concerns\MenuValidationRules;
use App\Models\Menu;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreMenuRequest extends FormRequest
{
    use MenuValidationRules;

    public function authorize(): bool
    {
        return $this->user()?->can('create', Menu::class) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return $this->menuRules();
    }
}
