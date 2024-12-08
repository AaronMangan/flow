<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Builder;
use App\Models\ActivityLog;
use Inertia\Inertia;

class ActivityLogController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function index(Request $request)
    {
        //
        return Inertia::render('ActivityLog/Index', [
            'history' => $this->getHistory($request->query()),
            'filters' => $request->query(),
        ]);
    }

    public function show(Request $request, ActivityLog $activityLog)
    {
        $event = $activityLog->load('user');

        if ($event->user->hasRole('super')) {
            $description = $event->event ?? 'modified';
            $event->note = "Super admin {$description} the object";
        } elseif ($event->user->hasRole('admin')) {
            $description = $event->event ?? 'modified';
            $event->note = "Organisation admin {$description} the object";
        } else {
            $description = $event->event ?? 'modified';
            $event->note = "The object was {$description} by a system process";
        }

        return Inertia::render('ActivityLog/View', [
            'data' => $event ?? []
        ]);
    }

    private function getHistory($filters)
    {
        $query = ActivityLog::query()->with('user');

        if (!empty($filters)) {
            array_map(function ($filter, $key) use ($query) {
                // If the model filter is being used.
                if ($key == 'model' && $filter != 'all') {
                    return $query->where('model_name', 'like', '%' . ucwords($filter) . '%');
                }

                if ($key == 'search' && isset($filter)) {
                    return $query->where(function (Builder $q) use ($filter) {
                        $q->where('model_name', 'like', "%{$filter}%")
                          ->orWhere('data', 'like', "%{$filter}%");
                    });
                }
            }, array_values($filters), array_keys($filters));
        }

        if (!auth()->user()->hasRole('super')) {
            $query->where('organisation_id', auth()->user()->organisation_id);
        }

        return $query->paginate(5);
    }
}
