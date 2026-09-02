<?php

use App\Http\Controllers\Example1Controller;
use App\Http\Controllers\Example2Controller;
use App\Http\Controllers\Example3Controller;
use App\Http\Controllers\Example4Controller;
use App\Http\Controllers\ParameterController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::resource('users', UserController::class);
    Route::resource('parameters', ParameterController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('example1', Example1Controller::class);
    Route::resource('example2', Example2Controller::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('example3', Example3Controller::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('example4', Example4Controller::class)->only(['index', 'store', 'update', 'destroy']);

    Route::inertia('examples', 'examples/index')->name('examples');
});

require __DIR__.'/settings.php';
