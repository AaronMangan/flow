<?php

namespace App\Http\Controllers\Transmittal;

use App\Http\Controllers\Controller;
use App\Models\Transmittal;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IncomingTransmittalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        //
        return Inertia::render('Transmittals/IncomingTransmittalIndex', [
            'transmittals' => $this->getIncomingTransmittals($request->all())
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
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
        // Confirm the user identity and if they can view the transmittal.
        if (!\Auth::user()->hasAnyRole(['super', 'admin'])) {
            abort(403);
        }

        // Render the receive transmittal page.
        return Inertia::render('Transmittals/ReceiveTransmittal', [
            'transmittal' => $transmittal->load('documents'),
        ]);
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

    private function getIncomingTransmittals(?array $filters): ?array
    {
        $query = Transmittal::query();

        $orgEmailList = \App\Models\User::where('organisation_id', \Auth::user()->organisation_id)->pluck('email')->toArray();

        // If the user is a super admin, return all documents.
        if (\Auth::user()->hasRole('super')) {
            $query->withoutGlobalScope(\App\Models\Scopes\OrganisationScope::class)
                ->where(function ($query) use ($orgEmailList) {
                    foreach ($orgEmailList as $email) {
                        $query->orWhereJsonContains('to', $email);
                    }
                });
        } else {
            // Otherwise, simply return the documents for that organisation.
            $query->where('organisation_id', \Auth::user()->organisation_id)
                ->where(function ($query) use ($orgEmailList) {
                    foreach ($orgEmailList as $email) {
                        $query->orWhereJsonContains('to', $email);
                    }
                });
        }

        // Add filters where supplied.
        if (isset($filters) && !empty($filters)) {
            // Handle adding constraints to the query via filters here.
            // $query->where(function ($subquery) use ($params) {
            //     return $subquery->where('to', 'like', "%{$params['to']}%");
            // });
        }

        return $query->get()
            ->load('documents', 'status')
            ->toArray() ?? [];
    }
}
