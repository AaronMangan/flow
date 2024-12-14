<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

// Public routes
Route::post('/auth/token', [AuthController::class, 'generateToken']);

Route::middleware(['auth:sanctum'])->group(function () {
    // Protected User API routes
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{id}', [UserController::class, 'show']);

    // Return the auth'd user.
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    /**
     * Return statuses
     */
    Route::get('statuses', function (Request $request) {
        $query = \App\Models\Status::query();
        $query->where('organisation_id', function ($sub) {
            return $sub->where('organisation_id', null)
                ->orWhere('organisation_id', auth()->user()->organisation_id);
        });
        // return response()->json($query->whereIn('organisation_id', [auth()->user()->organisation_id, null])->get()->toArray());
        return response()->json([
            'status' => 'success',
            'data' => \App\Models\Status::all()
        ], 200);
    });

    // Filter Data API.
    Route::get('/filters/models', function (Request $request) {
        $modelNames = \App\Models\ActivityLog::where('organisation_id', $request->user()->organisation_id)
            ->pluck('model_name')
            ->unique()
            ->toArray();
        $data = [];
        foreach ($modelNames as $model) {
            $name = str_replace('App\\Models\\', '', $model);
            $data[] = [
                'value' => strtolower($name),
                'label' => $name,
            ];
        }
        $data[0]['default'] = true;
        return response()->json([
            'status' => 'success',
            'data' => $data ?? []
        ]);
    });

    /**
     * Return the organisations, this route only works for super admins
     */
    Route::middleware(['role:super'])->get('/organisations', function (Request $request) {
        return \App\Models\Organisation::get(['id', 'name']);
    })->name('api.organisations');

    Route::get('config', function (Request $request) {
        return response()->json([
            'disciplines' => \App\Flow\Config::getConfigValue('disciplines') ?? false
        ]);
    });
});
