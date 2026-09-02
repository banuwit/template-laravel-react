<?php

use App\Models\User;
use Database\Seeders\UserSeeder;

test('user seeder creates one hundred users including the test account', function () {
    $this->seed(UserSeeder::class);

    expect(User::query()->count())->toBe(100);

    $testUser = User::query()->where('email', 'test@example.com')->first();

    expect($testUser)->not->toBeNull()
        ->and($testUser->name)->toBe('Test User');
});

test('user seeder fills existing users up to one hundred without duplicating the test account', function () {
    User::factory()->create([
        'name' => 'Test User',
        'email' => 'test@example.com',
    ]);
    User::factory()->create();

    $this->seed(UserSeeder::class);
    $this->seed(UserSeeder::class);

    expect(User::query()->count())->toBe(100)
        ->and(User::query()->where('email', 'test@example.com')->count())->toBe(1);
});
