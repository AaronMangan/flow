<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\ConfigController;
use App\Http\Controllers\Transmittal\TransmittalController;
use App\Http\Controllers\Public\PublicTransmittalController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

/**
 * User Routes
 */
Route::middleware('auth')->group(function () {
    Route::get('/users', [UserController::class, 'index'])->middleware(['role:super|admin|user'])->name('user.index');
    Route::post('/user/{user}/edit', [UserController::class, 'update'])->middleware(['role:super|admin'])->name('user.edit');
    Route::get('/user/create', [UserController::class, 'create'])->middleware(['role:super|admin'])->name('user.create');
    Route::post('/user/create', [UserController::class, 'store'])->middleware(['role:super|admin'])->name('users.create');
    Route::delete('/user/{user}/delete', [UserController::class, 'destroy'])->middleware(['role:super|admin'])->name('user.destroy');
});

/**
 * Config Routes
 */
Route::middleware(['role:super|admin', 'auth'])->group(function () {
    Route::get('/config', [ConfigController::class, 'index'])->middleware(['role:super|admin'])->name('config');
    Route::post('/config', [ConfigController::class, 'store'])->middleware(['role:super|admin'])->name('config.store');
    Route::post('/config/{config}/update', [ConfigController::class, 'update'])->middleware(['role:super|admin'])->name('config.update');
});

/**
 * Activity Log Routes
 */
Route::middleware(['role:super|admin', 'auth'])->group(function () {
    Route::get('/activity-log', [ActivityLogController::class, 'index'])->name('activity-log');
    Route::get('/activity-log/{activity_log}/view', [ActivityLogController::class, 'show'])->name('activity-log.show');
});

/**
 * Revisions routes
 */
Route::middleware(['role:super|admin', 'auth'])->group(function () {
    Route::get('/revisions', [\App\Http\Controllers\RevisionController::class, 'index'])->name('revisions');
    Route::post('/revision', [\App\Http\Controllers\RevisionController::class, 'store'])->name('revision.create');
    Route::post('/revision/{revision}/update', [\App\Http\Controllers\RevisionController::class, 'update'])->name('revision.update');
    Route::delete('/revision/{revision}/delete', [\App\Http\Controllers\RevisionController::class, 'destroy'])->name('revision.destroy');
});

/**
 * Statuses routes
 */
Route::middleware(['role:super|admin', 'auth'])->group(function () {
    Route::get('/statuses', [\App\Http\Controllers\DocumentStatusController::class, 'index'])->name('statuses');
    Route::post('/status', [\App\Http\Controllers\DocumentStatusController::class, 'store'])->name('status.create');
    Route::post('/status/{status}/update', [\App\Http\Controllers\DocumentStatusController::class, 'update'])->name('status.update');
    Route::delete('/status/{status}/delete', [\App\Http\Controllers\DocumentStatusController::class, 'destroy'])->name('status.destroy');
});

/**
 * Discipline Routes
 */
Route::middleware(['role:super|admin', 'auth', 'config:disciplines'])->group(function () {
    Route::get('/disciplines', [\App\Http\Controllers\DisciplineController::class, 'index'])->name('disciplines');
    Route::post('/discipline', [\App\Http\Controllers\DisciplineController::class, 'store'])->name('discipline.create');
    Route::post('/discipline/{discipline}/update', [\App\Http\Controllers\DisciplineController::class, 'update'])->name('discipline.update');
    Route::delete('/discipline/{discipline}/delete', [\App\Http\Controllers\DisciplineController::class, 'destroy'])->name('discipline.destroy');
});

/**
 * Type Routes
 */
Route::middleware(['role:super|admin', 'auth', 'config:types'])->group(function () {
    Route::get('/types', [\App\Http\Controllers\TypeController::class, 'index'])->name('types');
    Route::post('/type', [\App\Http\Controllers\TypeController::class, 'store'])->name('type.create');
    Route::post('/type/{type}/update', [\App\Http\Controllers\TypeController::class, 'update'])->name('type.update');
    Route::delete('/type/{type}/delete', [\App\Http\Controllers\TypeController::class, 'destroy'])->name('type.destroy');
});

/**
 * Area Routes
 */
Route::middleware(['role:super|admin', 'auth', 'config:areas'])->group(function () {
    Route::get('/areas', [\App\Http\Controllers\AreaController::class, 'index'])->name('areas');
    Route::post('/area', [\App\Http\Controllers\AreaController::class, 'store'])->name('area.create');
    Route::post('/area/{area}/update', [\App\Http\Controllers\AreaController::class, 'update'])->name('area.update');
    Route::delete('/area/{area}/delete', [\App\Http\Controllers\AreaController::class, 'destroy'])->name('area.destroy');
});

/**
 * Tag Routes
 */
Route::middleware(['role:super|admin', 'auth', 'config:tags'])->group(function () {
    Route::get('/tags', [\App\Http\Controllers\TagController::class, 'index'])->name('tags');
    Route::post('/tags', [\App\Http\Controllers\TagController::class, 'store'])->name('tag.create');
    Route::post('/tag/{tag}/update', [\App\Http\Controllers\AreaController::class, 'update'])->name('tag.update');
    Route::delete('/tag/{tag}/delete', [\App\Http\Controllers\AreaController::class, 'destroy'])->name('tag.destroy');
});

/**
 * Document Routes
 */
Route::middleware(['role:super|admin', 'auth'])->group(function () {
    Route::get('/documents', [\App\Http\Controllers\DocumentController::class, 'index'])->name('documents');
    Route::get('/documents/create', [\App\Http\Controllers\DocumentController::class, 'create'])->name('documents.create');
    Route::post('/documents', [\App\Http\Controllers\DocumentController::class, 'store'])->name('document.create');
    Route::get('/document/{document}/edit', [\App\Http\Controllers\DocumentController::class, 'edit'])->name('document.edit');
    Route::post('/document/{document}/update', [\App\Http\Controllers\DocumentController::class, 'update'])->name('document.update');
    Route::delete('/document/{document}/delete', [\App\Http\Controllers\AreaController::class, 'destroy'])->name('document.destroy');
});

/**
 * Transmittal Routes
 */
Route::middleware(['role:super|admin', 'auth'])->group(function () {
    Route::get('/transmittals', [TransmittalController::class, 'index'])->name('transmittals');
    Route::get('/transmittals/create', [TransmittalController::class, 'create'])->name('transmittal.create');
    Route::post('/transmittal/create', [TransmittalController::class, 'store'])->name('transmittal.store');
    Route::post('/transmittal/{transmittal}/send', [TransmittalController::class, 'send'])->name('transmittal.send');
});

/**
 * Public Transmittal Routes. These are used for the public to view and download the files.
 */
Route::middleware('signed')->controller(PublicTransmittalController::class)->group(function () {
    Route::get('view-transmittal', 'show')->name('view.transmittal');
    Route::post('acknowledge-transmittal', 'acknowledge')->name('acknowledge.transmittal');
});

// Add auth routes.
require __DIR__.'/auth.php';
