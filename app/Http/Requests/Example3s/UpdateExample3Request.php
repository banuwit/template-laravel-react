<?php

namespace App\Http\Requests\Example3s;

use App\Concerns\ExampleRecordValidationRules;
use App\Models\Example3;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateExample3Request extends FormRequest
{
    use ExampleRecordValidationRules;

    public function authorize(): bool
    {
        $example3 = $this->route('example3');

        return $example3 instanceof Example3
            && ($this->user()?->can('update', $example3) ?? false);
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $example3 = $this->route('example3');

        return $this->exampleRecordRules(
            Example3::class,
            $example3 instanceof Example3 ? $example3->id : null,
        );
    }
}
