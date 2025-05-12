<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CustomUserController;
use App\Http\Controllers\GenreController; 
use App\Http\Controllers\PublisherController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\BookGenreController;
use App\Http\Controllers\ReadingStatusController;
use App\Http\Controllers\ReviewController;
// Custom Users
Route::prefix('custom-users')->group(function () {
    Route::get('/', [CustomUserController::class, 'index']);
    Route::post('/', [CustomUserController::class, 'store']);
    Route::get('/{id}', [CustomUserController::class, 'show']);
    Route::put('/{id}', [CustomUserController::class, 'update']);
    Route::delete('/{id}', [CustomUserController::class, 'destroy']);
});

// Genres
Route::apiResource('genres', GenreController::class);

// Publishers
Route::apiResource('publishers', PublisherController::class);

// Books
Route::apiResource('books', BookController::class);

// BookGenre
Route::prefix('book-genre')->group(function () {
    Route::get('/', [BookGenreController::class, 'index']);
    Route::post('/', [BookGenreController::class, 'store']);
    Route::get('/{id}', [BookGenreController::class, 'show']);
    Route::put('/{id}', [BookGenreController::class, 'update']);
    Route::delete('/{id}', [BookGenreController::class, 'destroy']);
});

// Reading Statuses
Route::apiResource('reading-statuses', ReadingStatusController::class);

Route::apiResource('reviews', ReviewController::class);
