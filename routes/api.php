<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\HighscoreController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\SetController;
use App\Http\Controllers\UserProgressController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/highscores', [HighscoreController::class, 'index']);
Route::post('/highscores', [HighscoreController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/courses', [CourseController::class, 'index']);
    Route::get('/courses/{course_slug}', [CourseController::class, 'show']);
    Route::post('/courses/{course_slug}/register', [EnrollmentController::class, 'store']);
    Route::get('/users/progress', [UserProgressController::class, 'index']);

    Route::post('/lessons/{lesson_id}/contents/{content_id}/check', [LessonController::class, 'check']);
    Route::put('/lessons/{lesson_id}/complete', [LessonController::class, 'complete']);

    Route::middleware('admin')->group(function () {
        Route::post('/courses', [CourseController::class, 'store']);
        Route::put('/courses/{course_slug}', [CourseController::class, 'update']);
        Route::delete('/courses/{course_slug}', [CourseController::class, 'destroy']);

        Route::post('/courses/{course}/sets', [SetController::class, 'store']);
        Route::delete('/courses/{course}/sets/{set_id}', [SetController::class, 'destroy']);

        Route::post('/lessons', [LessonController::class, 'store']);
        Route::delete('/lessons/{lesson_id}', [LessonController::class, 'destroy']);
    });
});
