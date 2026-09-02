<?php

use Database\Seeders\ParameterSeeder;
use Illuminate\Support\Facades\DB;

test('parameter seeder creates twenty five reference rows', function () {
    $this->seed(ParameterSeeder::class);

    expect(DB::table('parameters')->count())->toBe(25)
        ->and(DB::table('parameters')->where('code', 'status_active')->exists())->toBeTrue()
        ->and(DB::table('parameters')->where('code', 'approval_approved')->exists())->toBeTrue();
});

test('parameter seeder does not duplicate rows when run again', function () {
    $this->seed(ParameterSeeder::class);
    $this->seed(ParameterSeeder::class);

    expect(DB::table('parameters')->count())->toBe(25)
        ->and(DB::table('parameters')->where('code', 'status_active')->count())->toBe(1);
});
