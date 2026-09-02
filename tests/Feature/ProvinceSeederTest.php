<?php

use App\Models\Country;
use App\Models\Province;
use Database\Seeders\ProvinceSeeder;

test('province seeder creates all indonesian provinces', function () {
    $this->seed(ProvinceSeeder::class);

    $country = Country::query()->where('code', 'ID')->first();

    expect($country)->not->toBeNull()
        ->and(Province::query()->count())->toBe(38)
        ->and(Province::query()->where('country_id', $country->id)->count())->toBe(38)
        ->and(Province::query()->where('name', 'Papua Barat Daya')->exists())->toBeTrue()
        ->and(Province::query()->where('name', 'DKI Jakarta')->exists())->toBeTrue();
});

test('province seeder does not duplicate provinces when run again', function () {
    $this->seed(ProvinceSeeder::class);
    $this->seed(ProvinceSeeder::class);

    expect(Province::query()->count())->toBe(38)
        ->and(Province::query()->where('name', 'Jawa Timur')->count())->toBe(1);
});
