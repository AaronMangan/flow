<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\Document\ApiDocumentController;
use App\Models\Config;

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

    /**
     * Return disciplines for the organisation
     */
    Route::middleware(['role:super|admin', 'config:disciplines'])->get('/disciplines', function (Request $request) {
        //
        $query = \App\Models\Discipline::query();

        // Handle search if specified.
        if ($request->has('search')) {
            $search = $request->search ?? null;
            $query->where(function ($q) use ($search) {
                return $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            });
        }

        // For super users return everything.
        if ($request->user()->hasRole('super')) {
            return response()->json(['status' => 'success', 'data' => $query->get(['id', 'code', 'name'])]);
        }

        // For admin return org disciplines
        $data = $query->where('organisation_id', $request->user()->organisation_id)
            ->get(['id', 'code', 'name'])
            ->toArray();
        return response()->json(['status' => 'success', 'data' => $data]);
    })->name('api.disciplines');


    /**
     * Return types for the organisation
     */
    Route::middleware(['role:super|admin', 'config:types'])->get('/types', function (Request $request) {
        // Confirm the user can make the request.
        if ($request->user()->cannot('viewAny', \App\Models\Type::class)) {
            abort(403);
        }

        $query = \App\Models\Type::query();

        if ($request->has('search')) {
            $search = $request->search ?? null;
            $query->where(function ($q) use ($search) {
                return $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            });
        }

        if ($request->user()->hasRole('super')) {
            return response()->json(['status' => 'success', 'data' => $query->get(['id', 'code', 'name'])]);
        }

        $data = $query->where('organisation_id', $request->user()->organisation_id)
            ->get(['id', 'code', 'name'])
            ->toArray();
        return response()->json(['status' => 'success', 'data' => $data]);

    })->name('api.types');

    /**
     * Return areas for the organisation
     */
    Route::middleware(['role:super|admin', 'config:areas'])->get('/areas', function (Request $request) {
        // Confirm the user can make the request.
        if ($request->user()->cannot('viewAny', \App\Models\Area::class)) {
            abort(403);
        }

        $query = \App\Models\Area::query();

        if ($request->has('search')) {
            $search = $request->search ?? null;
            $query->where(function ($q) use ($search) {
                return $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            });
        }

        if ($request->user()->hasRole('super')) {
            return response()->json(['status' => 'success', 'data' => $query->get(['id', 'code', 'name'])]);
        }

        $data = $query->where('organisation_id', $request->user()->organisation_id)
            ->get(['id', 'code', 'name'])
            ->toArray();
        return response()->json(['status' => 'success', 'data' => $data]);

    })->name('api.areas');

    /**
     * Return statuses for the organisation
     */
    Route::middleware(['role:super|admin'])->get('/statuses', function (Request $request) {
        // Confirm the user can make the request.
        if ($request->user()->cannot('viewAny', \App\Models\DocumentStatus::class)) {
            abort(403);
        }

        $query = \App\Models\DocumentStatus::query();

        if ($request->has('search')) {
            $search = $request->search ?? null;
            $query->where(function ($q) use ($search) {
                return $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            });
        }

        if ($request->user()->hasRole('super')) {
            return response()->json(['status' => 'success', 'data' => $query->get(['id', 'code', 'name'])]);
        }

        $data = $query->where('organisation_id', $request->user()->organisation_id)
            ->get(['id', 'code', 'name'])
            ->toArray();
        return response()->json(['status' => 'success', 'data' => $data]);

    })->name('api.statuses');

    /**
     * Return revisions for the organisation
     */
    Route::middleware(['role:super|admin'])->get('/revisions', function (Request $request) {
        // Confirm the user can make the request.
        if ($request->user()->cannot('viewAny', \App\Models\Revision::class)) {
            abort(403);
        }

        $query = \App\Models\Revision::query();

        if ($request->has('search')) {
            $search = $request->search ?? null;
            $query->where(function ($q) use ($search) {
                return $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            });
        }

        if ($request->user()->hasRole('super')) {
            return response()->json(['status' => 'success', 'data' => $query->get(['id', 'name', 'code'])]);
        }

        $data = $query->where('organisation_id', $request->user()->organisation_id)
            ->get(['id', 'name', 'code'])
            ->toArray();
        return response()->json(['status' => 'success', 'data' => $data]);

    })->name('api.revisions');

    /**
     * Returns tags for orgs that use them
     */
    Route::middleware(['role:super|admin', 'config:tags'])->get('/tags', function (Request $request) {
        $query = \App\Models\Tag::query();

        if ($request->has('search')) {
            $search = $request->search ?? null;
            $query->where(function ($q) use ($search) {
                return $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            });
        }

        if ($request->user()->hasRole('super')) {
            return response()->json(['status' => 'success', 'data' => $query->get(['id', 'name'])]);
        }

        $data = $query->where('organisation_id', $request->user()->organisation_id)
            ->get(['id', 'name'])
            ->toArray();
        return response()->json(['status' => 'success', 'data' => $data]);

    })->name('api.tags');

    /**
     * Returns the selected values from the configurable settings.
     */
    Route::middleware(['role:super|admin|user', 'auth'])->get('/metadata', function (Request $request) {
        $output = [];

        // Check that a value was provided and is a valid string
        if (!$request->has('values') || is_null($request->values) || empty($request->values) || gettype($request->values) !== "string") {
            return response()->json([
                'status' => 'fail',
                'message' => 'Please provide values to be returned'
            ]);
        }

        // Get the keys to returned.
        $requestedKeys = explode(',', $request->query('values', ''));

        // Get the configs that match those keys.
        $configurations = Config::where('organisation_id', $request->user()->organisation_id)->whereIn('key', $requestedKeys)->get()->toArray();

        // Iterate over the configuration values for the org.
        foreach ($configurations as $config) {
            $output[$config['key']] = $config['values'] ?? [];
        }

        // Return the information.
        return response()->json([
            'status' => 'success',
            'data' => $output
        ]);
    })->name('metadata');

    /**
     * Returns users of other organisations, where connections have been established.
     */
    Route::middleware(['role:super|admin', 'auth'])->get('/user-select', function (Request $request) {
        // Get the users.
        $users = \App\Models\User::where('organisation_id', $request->user()->organisation_id)->get(['id', 'name', 'organisation_id', 'email'])->toArray();

        // Response being returned.
        return response()->json([
            'status' => 'success',
            'data' => $users ?? []
        ]);
    })->name('api.user-select');

    /**
     * Searches for documents
     */
    // Route::middleware(['role:super|admin', 'auth'])->get('/document-list', [\App\Http\Controllers\Api\Document\ApiDocumentController::class, 'index'])->name('api.document-list');
    Route::middleware(['role:super|admin', 'auth'])->get('/document-list', [ApiDocumentController::class, 'index'])->name('api.document-list');
});
