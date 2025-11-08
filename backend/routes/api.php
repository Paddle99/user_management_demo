<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;

// List all users
Route::get('/users', [UserController::class, 'index']);

// Show a specific user
Route::get('/users/{id}', [UserController::class, 'show']);

// Create a new user
Route::post('/users', [UserController::class, 'store']);

// Update an existing user
Route::put('/users/{id}', [UserController::class, 'update']);

// Delete a user
Route::delete('/users/{id}', [UserController::class, 'destroy']);
