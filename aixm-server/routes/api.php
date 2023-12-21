<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Aixm\DatasetController;
use App\Http\Controllers\Aixm\FeatureController;
use App\Http\Controllers\Aixm\PropertyController;
use App\Http\Controllers\Aixm\DatasetFeatureController;
use App\Http\Controllers\Auth\UserController;
use App\Http\Controllers\Auth\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/


Route::prefix('v1')->group( function () {

    Route::prefix('auth')->group( function () {
        Route::post('/login', [AuthController::class, 'login']);
        Route::middleware(['auth:api'])->group( function () {
            Route::get('/logout', [AuthController::class, 'logout']);
            Route::get('/user', [AuthController::class, 'user']);
        });
    });

    Route::middleware(['auth:api'])->group( function () {
        Route::apiResource('/users', UserController::class);
        Route::prefix('aixm')->group( function () {
            Route::apiResource('/datasets', DatasetController::class);
            Route::apiResource('/features', FeatureController::class);
            Route::apiResource('/properties', PropertyController::class);
        });
    });

    Route::prefix('aixm')->group( function () {
        Route::apiResource('/datasets', DatasetController::class);
        Route::apiResource('/features', FeatureController::class);
        Route::apiResource('/properties', PropertyController::class);
        Route::apiResource('/dataset_features', DatasetFeatureController::class);
        Route::apiResource('/datasets/{dataset}/features', DatasetFeatureController::class);
        Route::get('/datasets/{dataset}/features_list', [DatasetFeatureController::class, 'list']);
        Route::get('/datasets/{dataset}/features_list/{feature}', [DatasetFeatureController::class, 'features']);
        Route::get('/dataset_features/{dataset_feature}/reference_to', [DatasetFeatureController::class, 'reference_to']);
        Route::get('/dataset_features/{dataset_feature}/referenced_by', [DatasetFeatureController::class, 'referenced_by']);
    });

});


