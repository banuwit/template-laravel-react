<?php

use App\Models\Country;
use Database\Seeders\CountrySeeder;

test('country seeder creates indonesia', function () {
    $this->seed(CountrySeeder::class);

    expect(Country::query()->count())->toBe(1);

    $country = Country::query()->where('code', 'ID')->first();

    expect($country)->not->toBeNull()
        ->and($country->name)->toBe('Indonesia');
});

test('country seeder does not duplicate indonesia when run again', function () {
    $this->seed(CountrySeeder::class);
    $this->seed(CountrySeeder::class);

    expect(Country::query()->count())->toBe(1)
        ->and(Country::query()->where('code', 'ID')->count())->toBe(1);
});
