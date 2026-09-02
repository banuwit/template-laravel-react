<?php

use App\Models\City;
use Database\Seeders\CitySeeder;

test('city seeder creates one hundred indonesian cities', function () {
    $this->seed(CitySeeder::class);

    expect(City::query()->count())->toBe(100)
        ->and(City::query()->where('name', 'Surabaya')->exists())->toBeTrue()
        ->and(City::query()->where('name', 'Jakarta')->exists())->toBeTrue();

    $surabaya = City::query()->where('name', 'Surabaya')->first();
    $jakarta = City::query()->where('name', 'Jakarta')->first();

    expect($surabaya?->province?->name)->toBe('Jawa Timur')
        ->and($jakarta?->province?->name)->toBe('DKI Jakarta')
        ->and(City::query()->distinct()->count('province_id'))->toBe(38);
});

test('city seeder does not duplicate cities when run again', function () {
    $this->seed(CitySeeder::class);
    $this->seed(CitySeeder::class);

    expect(City::query()->count())->toBe(100)
        ->and(City::query()->where('name', 'Medan')->count())->toBe(1);
});
