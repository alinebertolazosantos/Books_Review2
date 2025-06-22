<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Controllers
use App\Http\Controllers\CustomUserController;
use App\Http\Controllers\GenreController;
use App\Http\Controllers\PublisherController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\BookGenreController;
use App\Http\Controllers\ReadingStatusController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\AuthController;



//Auth (Sanctum)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLink']);
Route::post('/reset-password', [PasswordResetController::class, 'reset']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


//Custom Users
Route::prefix('custom-users')->group(function () {
    Route::get('/', [CustomUserController::class, 'index']);
    Route::post('/', [CustomUserController::class, 'store']);
    Route::get('/{id}', [CustomUserController::class, 'show']);
    Route::put('/{id}', [CustomUserController::class, 'update']);
    Route::delete('/{id}', [CustomUserController::class, 'destroy']);
});

// Books
Route::apiResource('books', BookController::class);


// Genres
Route::apiResource('genres', GenreController::class);


// Publishers
Route::apiResource('publishers', PublisherController::class);

// Book-Genre Relationship
Route::prefix('book-genre')->group(function () {
    Route::get('/', [BookGenreController::class, 'index']);
    Route::post('/', [BookGenreController::class, 'store']);
    Route::get('/{id}', [BookGenreController::class, 'show']);
    Route::put('/{id}', [BookGenreController::class, 'update']);
    Route::delete('/{id}', [BookGenreController::class, 'destroy']);
});


//Reading Statuses

Route::apiResource('reading-statuses', ReadingStatusController::class);


// Reviews
Route::apiResource('reviews', ReviewController::class);

//Forgot Password
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);

//Reset Password
Route::post('/reset-password/{id}/{token}', [AuthController::class, 'resetPassword']);

//Change Password
Route::middleware('auth:sanctum')->post('/change-password', [AuthController::class, 'changePassword']);

//Reset Password
Route::post('/reset-password/{id}/{token}', [AuthController::class, 'resetPassword']);
