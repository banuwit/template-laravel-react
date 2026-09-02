<?php

namespace Database\Seeders;

use App\Models\Menu;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MenuSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Menu::query()->firstOrCreate(
            ['slug' => 'dashboard'],
            ['name' => 'Dashboard', 'icon' => 'layout-grid', 'route_name' => 'dashboard', 'sort_order' => 0],
        );

        Menu::query()->firstOrCreate(
            ['slug' => 'users'],
            ['name' => 'Users', 'icon' => 'users', 'route_name' => 'users.index', 'sort_order' => 10],
        );

        $settings = Menu::query()->firstOrCreate(
            ['slug' => 'settings'],
            ['name' => 'Settings', 'icon' => 'settings', 'sort_order' => 20],
        );

        Menu::query()->firstOrCreate(
            ['slug' => 'settings-profile'],
            [
                'name' => 'Profile',
                'parent_id' => $settings->id,
                'level' => $settings->level + 1,
                'route_name' => 'profile.edit',
                'sort_order' => 0,
            ],
        );

        Menu::query()->firstOrCreate(
            ['slug' => 'settings-appearance'],
            [
                'name' => 'Appearance',
                'parent_id' => $settings->id,
                'level' => $settings->level + 1,
                'route_name' => 'appearance.edit',
                'sort_order' => 10,
            ],
        );
    }
}
