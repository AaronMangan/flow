<?php

namespace App\Http\Controllers;

use App\Models\DocumentStatus;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\DocumentStatuses\StoreDocumentStatusRequest;

class DocumentStatusController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render('Meta/ViewDocumentStatuses', [
            'statuses' => $this->getStatuses()
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
    public function store(StoreDocumentStatusRequest $request)
    {
        // Authorise the action.
        if ($request->user()->cannot('create', DocumentStatus::class)) {
            abort(403);
        }

        // Get the validated data.
        $data = $request->safe()->only(['name', 'code', 'description', 'draft']);

        // Create the new DocumentStatus.
        $status = DocumentStatus::create([
            'name' => $data['name'] ?? null,
            'code' => $data['code'] ?? null,
            'description' => $data['description'] ?? null,
            'draft' => $data['draft'] ?? false,
            'organisation_id' => \Auth::user()->organisation_id,
            'user_id' => \Auth::user()->id
        ]);

        return Inertia::render('Meta/ViewDocumentStatuses', [
            'revisions' => $this->getStatuses(),
            'status' => $status ? 'success' : 'fail'
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(DocumentStatus $status)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(DocumentStatus $status)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreDocumentStatusRequest $request, DocumentStatus $status)
    {
        // The request object takes care of authorisation.
        // Get the data.
        $data = $request->safe()->only(['name', 'code', 'description', 'draft']);

        // Update the status
        $result = $status->update($data);

        return Inertia::render('Meta/ViewDocumentStatuses', [
            'revisions' => $this->getStatuses(),
            'status' => $result ? 'success' : 'fail'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, DocumentStatus $status)
    {
        // User must have permission to delete a revision
        if (!$request->user()->hasAnyRole(['super', 'admin'])) {
            abort(404);
        }

        $status->delete();

        return response(200);
    }

    private function getStatuses(): ?array
    {
        $query = DocumentStatus::query();

        if (\Auth::user()->hasRole('super')) {
            return $query->get()->toArray();
        }

        return $query->where('organisation_id', \Auth::user()->organisation_id)
            ->get()->toArray();
    }
}
