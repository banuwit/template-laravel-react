<?php

namespace Database\Factories;

use App\Enums\MenuLayout;
use App\Models\Menu;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Menu>
 */
class MenuFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = ucwords(fake()->unique()->word().' '.fake()->word());

        return [
            'name' => $name,
            'slug' => str($name)->slug(),
            'icon' => fake()->randomElement(['layout-grid', 'users', 'settings', 'file-text']),
            'route_name' => null,
            'route_pattern' => null,
            'parent_id' => null,
            'level' => 0,
            'sort_order' => fake()->numberBetween(0, 100),
            'layout' => fake()->randomElement(MenuLayout::cases()),
            'is_active' => true,
        ];
    }

    public function child(Menu $parent): static
    {
        return $this->state(fn (): array => [
            'parent_id' => $parent->id,
            'level' => $parent->level + 1,
            'layout' => $parent->layout,
        ]);
    }

    public function inactive(): static
    {
        return $this->state(fn (): array => [
            'is_active' => false,
        ]);
    }
}
