<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DocumentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Authorise the action.
        if ($request->user()->cannot('viewAny', Document::class)) {
            abort(403);
        }

        // Return
        return Inertia::render('Documents/DocumentIndex', [
            'documents' => $this->getDocuments()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        // Authorise the action.
        if ($request->user()->cannot('create', Document::class)) {
            abort(403);
        }

        // Return
        return Inertia::render('Documents/DocumentCreateOrEdit');
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
    public function show(Document $document)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Document $document)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Document $document)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Document $document)
    {
        //
    }

    /**
     * Returns documents for the organisation.
     *
     * @return array
     */
    private function getDocuments(): array
    {
        $query = Document::query();

        if (\Auth::user()->hasRole('super')) {
            return $query->get()->toArray();
        }

        return $query->where('organisation_id', \Auth::user()->organisation_id)
            ->get()->toArray() ?? [];
    }
}
