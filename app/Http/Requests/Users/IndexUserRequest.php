<?php

namespace App\Http\Requests\Users;

use App\Enums\Gender;
use App\Enums\Status;
use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class IndexUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('viewAny', User::class) ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'search' => ['nullable', 'string', 'max:255'],
            'sort' => ['nullable', 'in:name,email,phone,department,position,join_date,status,gender,created_at'],
            'direction' => ['nullable', 'in:asc,desc'],
            'department' => ['nullable', 'array'],
            'department.*' => ['string', 'max:100'],
            'position' => ['nullable', 'array'],
            'position.*' => ['string', 'max:100'],
            'status' => ['nullable', 'array'],
            'status.*' => [new Enum(Status::class)],
            'gender' => ['nullable', 'array'],
            'gender.*' => [new Enum(Gender::class)],
        ];
    }

    public function search(): ?string
    {
        $search = $this->validated('search');

        return is_string($search) && $search !== '' ? $search : null;
    }

    /**
     * @return 'name'|'email'|'phone'|'department'|'position'|'join_date'|'status'|'gender'|'created_at'
     */
    public function sort(): string
    {
        $sort = $this->validated('sort');

        return in_array($sort, ['name', 'email', 'phone', 'department', 'position', 'join_date', 'status', 'gender', 'created_at'], true)
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

    /**
     * @return array<int, string>
     */
    public function departments(): array
    {
        return $this->validated('department') ?? [];
    }

    /**
     * @return array<int, string>
     */
    public function positions(): array
    {
        return $this->validated('position') ?? [];
    }

    /**
     * @return array<int, string>
     */
    public function statuses(): array
    {
        return $this->validated('status') ?? [];
    }

    /**
     * @return array<int, string>
     */
    public function genders(): array
    {
        return $this->validated('gender') ?? [];
    }
}
