<?php

namespace App\Http\Controllers\Transmittal;

use App\Models\Transmittal;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class TransmittalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Authorize the action.
        if ($request->user()->cannot('viewAny', Transmittal::class)) {
            abort(403);
        }

        // Return
        return Inertia::render('Transmittals/TransmittalIndex', [
            'transmittals' => $this->getTransmittals($request->all()),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        // Check that the user can create a transmittal. If not, then abort the request.
        if ($request->user()->cannot('create', Transmittal::class)) {
            abort(403);
        }

        // Return the transmittal index.
        return Inertia::render('Transmittals/CreateTransmittal', [
            'transmittals' => $this->getTransmittals($request->all()),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Transmittal $transmittal)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Transmittal $transmittal)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Transmittal $transmittal)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Transmittal $transmittal)
    {
        //
    }

    /**
     * Get an index of transmittals, using an supplied filters.
     *
     * @param array $params
     * @return array
     */
    private function getTransmittals(array $params): array
    {
        $query = Transmittal::query();

        // Add filters where supplied.
        if (isset($params['to'])) {
            $query->where(function ($subquery) use ($params) {
                return $subquery->where('to', 'like', "%{$params['to']}%");
            });
        }

        // If the user is a super admin, return all documents.
        if (\Auth::user()->hasRole('super')) {
            return $query->get()->load('documents', 'status')->toArray();
        }

        // Otherwise, simply return the documents for that organisation.
        return $query->where('organisation_id', \Auth::user()->organisation_id)
            ->get()->load('documents', 'status')->toArray() ?? [];
    }
}
