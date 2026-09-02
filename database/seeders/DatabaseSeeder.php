<?php

use Database\Seeders\CitySeeder;
use Database\Seeders\CountrySeeder;
use Database\Seeders\MenuSeeder;
use Database\Seeders\ParameterSeeder;
use Database\Seeders\ProvinceSeeder;
use Database\Seeders\UserSeeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            ParameterSeeder::class,
            CountrySeeder::class,
            ProvinceSeeder::class,
            CitySeeder::class,
            MenuSeeder::class,
        ]);
    }
}
