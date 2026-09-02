<?php

namespace App\Concerns;

use App\Enums\Gender;
use App\Enums\Status;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;

trait ExampleRecordValidationRules
{
    /**
     * @param  class-string<Model>  $modelClass
     * @return array<string, array<int, ValidationRule|array<mixed>|string>>
     */
    protected function exampleRecordRules(string $modelClass, ?int $recordId = null): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                $recordId === null
                    ? Rule::unique($modelClass)
                    : Rule::unique($modelClass)->ignore($recordId),
            ],
            'phone' => ['required', 'string', 'max:30'],
            'department' => ['required', 'string', 'max:100'],
            'position' => ['required', 'string', 'max:100'],
            'join_date' => ['required', 'date'],
            'gender' => ['required', new Enum(Gender::class)],
            'status' => ['required', new Enum(Status::class)],
        ];
    }
}
