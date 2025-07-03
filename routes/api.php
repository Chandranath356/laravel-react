<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:api');

Route::post('login', [AuthenticatedSessionController::class, 'store']);

Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout')->middleware('auth:api');

Route::post('service-worker', [AuthenticatedSessionController::class, 'userStore']);
Route::post('store-user', [AuthenticatedSessionController::class, 'userStore'])->middleware('auth:api');