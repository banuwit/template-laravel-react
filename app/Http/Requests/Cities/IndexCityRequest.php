<?php

namespace App\Http\Requests\Cities;

use App\Models\City;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class IndexCityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('viewAny', City::class) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'search' => ['nullable', 'string', 'max:255'],
            'sort' => ['nullable', 'in:name,created_at'],
            'direction' => ['nullable', 'in:asc,desc'],
        ];
    }

    public function search(): ?string
    {
        $search = $this->validated('search');

        return is_string($search) && $search !== '' ? $search : null;
    }

    /**
     * @return 'name'|'created_at'
     */
    public function sort(): string
    {
        $sort = $this->validated('sort');

        return in_array($sort, ['name', 'created_at'], true)
            ? $sort
            : 'name';
    }

    /**
     * @return 'asc'|'desc'
     */
    public function direction(): string
    {
        $direction = $this->validated('direction');

        return $direction === 'desc' ? 'desc' : 'asc';
    }
}
