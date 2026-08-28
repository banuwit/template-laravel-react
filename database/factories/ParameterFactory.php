<?php

namespace Database\Factories;

use App\Models\Parameter;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Parameter>
 */
class ParameterFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'group' => $this->faker->word(),
            'code' => $this->faker->unique()->lexify('code_????????'),
            'value' => $this->faker->words(2, true),
            'description' => $this->faker->optional()->sentence(),
            'text_color' => null,
            'bg_color' => null,
            'attributes' => null,
            'is_system' => false,
            'is_active' => true,
            'sort_order' => $this->faker->numberBetween(0, 100),
        ];
    }
}
