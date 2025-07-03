<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/{any?}', function () {
    return view('app');
})->where('any', '.*');


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
