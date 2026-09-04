<?php

use Illuminate\Support\Facades\Route;

test('returns a successful response', function () {
    $response = $this->get(route('home'));

    $response->assertOk();
});

test('example demo pages are not registered', function () {
    expect(Route::has('examples'))->toBeFalse()
        ->and(Route::has('example1.index'))->toBeFalse()
        ->and(Route::has('example2.index'))->toBeFalse()
        ->and(Route::has('example3.index'))->toBeFalse()
        ->and(Route::has('example4.index'))->toBeFalse();
});
