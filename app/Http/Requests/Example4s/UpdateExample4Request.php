<?php

namespace App\Http\Requests\Example4s;

use App\Concerns\ExampleRecordValidationRules;
use App\Models\Example4;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateExample4Request extends FormRequest
{
    use ExampleRecordValidationRules;

    public function authorize(): bool
    {
        $example4 = $this->route('example4');

        return $example4 instanceof Example4
            && ($this->user()?->can('update', $example4) ?? false);
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $example4 = $this->route('example4');

        return $this->exampleRecordRules(
            Example4::class,
            $example4 instanceof Example4 ? $example4->id : null,
        );
    }
}
