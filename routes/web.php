<?php

use App\Http\Controllers\CityController;
use App\Http\Controllers\CountryController;
use App\Http\Controllers\ParameterController;
use App\Http\Controllers\ProvinceController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::resource('users', UserController::class);
    Route::resource('parameters', ParameterController::class);
    Route::resource('countries', CountryController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('provinces', ProvinceController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('cities', CityController::class)->only(['index', 'store', 'update', 'destroy']);

    Route::inertia('examples', 'examples/index')->name('examples');
});

require __DIR__.'/settings.php';
