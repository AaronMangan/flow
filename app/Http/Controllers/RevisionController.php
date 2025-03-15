<?php

namespace App\Http\Controllers;

use App\Models\Revision;
use Illuminate\Http\Request;
use App\Http\Requests\StoreRevisionRequest;
use Inertia\Inertia;

class RevisionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render('Meta/ViewRevisions', [
            'revisions' => $this->getRevisions()
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
    public function store(StoreRevisionRequest $request)
    {
        // Authorise the action.
        if ($request->user()->cannot('create', Revision::class)) {
            abort(403);
        }

        // Get the validated data.
        $data = $request->safe()->only(['name', 'code', 'description', 'draft']);

        // Create the new revision.
        $rev = Revision::create([
            'name' => $data['name'] ?? null,
            'code' => $data['code'] ?? null,
            'description' => $data['description'] ?? null,
            'draft' => $data['draft'] ?? false,
            'organisation_id' => \Auth::user()->organisation_id,
            'user_id' => \Auth::user()->id
        ]);

        return Inertia::render('Meta/ViewRevisions', [
            'revisions' => $this->getRevisions(),
            'status' => $rev ? 'success' : 'fail'
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Revision $revision)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Revision $revision)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreRevisionRequest $request, Revision $revision)
    {
        $data = $request->safe()->only(['name', 'code', 'description', 'draft']);
        $result = $revision->update($data);

        return Inertia::render('Meta/ViewRevisions', [
            'revisions' => $this->getRevisions(),
            'status' => $result ? 'success' : 'fail'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Revision $revision)
    {
        // User must have permission to delete a revision
        if (!$request->user()->hasAnyRole(['super', 'admin'])) {
            abort(404);
        }

        $revision->delete();

        return response(200);
    }

    private function getRevisions(): ?array
    {
        $query = Revision::query();

        if (\Auth::user()->hasRole('super')) {
            return $query->get()->toArray();
        }

        return $query->where('organisation_id', \Auth::user()->organisation_id)
            ->get()->toArray();
    }
}
