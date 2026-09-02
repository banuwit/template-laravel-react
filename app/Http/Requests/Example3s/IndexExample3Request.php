<?php

namespace App\Http\Requests\Example3s;

use App\Models\Example3;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class IndexExample3Request extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('viewAny', Example3::class) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'search' => ['nullable', 'string', 'max:255'],
            'sort' => ['nullable', 'in:name,email,department,position,join_date,status,created_at'],
            'direction' => ['nullable', 'in:asc,desc'],
        ];
    }

    public function search(): ?string
    {
        $search = $this->validated('search');

        return is_string($search) && $search !== '' ? $search : null;
    }

    /**
     * @return 'name'|'email'|'department'|'position'|'join_date'|'status'|'created_at'
     */
    public function sort(): string
    {
        $sort = $this->validated('sort');

        return in_array($sort, ['name', 'email', 'department', 'position', 'join_date', 'status', 'created_at'], true)
            ? $sort
            : 'created_at';
    }

    /**
     * @return 'asc'|'desc'
     */
    public function direction(): string
    {
        $direction = $this->validated('direction');

        return $direction === 'asc' ? 'asc' : 'desc';
    }
}
