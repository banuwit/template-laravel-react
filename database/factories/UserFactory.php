<?php

namespace Database\Factories;

use App\Enums\Gender;
use App\Enums\Status;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'phone' => fake()->numerify('+1 555-####'),
            'department' => fake()->randomElement(['Engineering', 'Marketing', 'Operations', 'Finance']),
            'position' => fake()->randomElement([
                'Software Engineer',
                'Campaign Manager',
                'Operations Lead',
                'Financial Analyst',
                'QA Engineer',
            ]),
            'join_date' => fake()->dateTimeBetween('-5 years', '-1 month'),
            'gender' => fake()->randomElement(Gender::cases()),
            'status' => fake()->randomElement(Status::cases()),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * Indicate that the model has two-factor authentication configured.
     */
    public function withTwoFactor(): static {}
}
