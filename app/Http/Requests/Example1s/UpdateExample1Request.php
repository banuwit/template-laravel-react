<?php

namespace App\Http\Requests\Example1s;

use App\Concerns\ExampleRecordValidationRules;
use App\Models\Example1;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateExample1Request extends FormRequest
{
    use ExampleRecordValidationRules;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $example1 = $this->route('example1');

        return $example1 instanceof Example1
            && ($this->user()?->can('update', $example1) ?? false);
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $example1 = $this->route('example1');

        return $this->exampleRecordRules(
            Example1::class,
            $example1 instanceof Example1 ? $example1->id : null,
        );
    }
}
