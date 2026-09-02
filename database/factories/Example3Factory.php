<?php

namespace Database\Factories;

use App\Enums\Gender;
use App\Enums\Status;
use App\Models\Example3;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Example3>
 */
class Example3Factory extends Factory
{
    protected $model = Example3::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'department' => fake()->randomElement(['Engineering', 'Marketing', 'Operations', 'Finance']),
            'position' => fake()->jobTitle(),
            'join_date' => fake()->dateTimeBetween('-5 years', '-1 month'),
            'gender' => fake()->randomElement(Gender::cases()),
            'status' => fake()->randomElement(Status::cases()),
        ];
    }
}
