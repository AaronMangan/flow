<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\Documents\CreateNewDocumentRequest;
use App\Http\Requests\Documents\UpdateDocumentRequest;
use App\Traits\GeneratesDocumentNumbers;
use App\Models\Scopes\OrganisationScope;

class DocumentController extends Controller
{
    use GeneratesDocumentNumbers;

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
            'documents' => $this->getDocuments($request->all()),
            'messages' => [],
            'metadata' => $this->getMetadata(),
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
    public function store(CreateNewDocumentRequest $request)
    {
        // Get the user once, otherwise it's called whenever we want a property. We can also do a final check
        // to make sure this user can perform the action.
        $user = $request->user();

        // Get validated data.
        $validated = $request->safe()->only([
            'name', 'area_id', 'discipline_id', 'is_placeholder', 'revision_id', 'status_id', 'tags', 'type_id', 'description'
        ]);

        $number = self::generate($validated);

        $document = Document::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'user_id' => $user->id,
            'organisation_id' => $user->organisation_id ?? null,
            'document_status_id' => $validated['status_id'] ?? null,
            'discipline_id' => $validated['discipline_id'] ?? null,
            'type_id' => $validated['type_id'] ?? null,
            'area_id' => $validated['area_id'] ?? null,
            'revision_id' => $validated['revision_id'] ?? null,
            'document_number' => $number ?? null
        ]);

        $messages = [];
        if (isset($document->id)) {
            $messages['success'] = 'Document created successfully';
        } else {
            $messages['error'] = 'An error occurred, please try again';
        }

        // If the document was saved, then render the index.
        return Inertia::render('Documents/DocumentIndex', [
            'documents' => $this->getDocuments([]),
            'messages' => $messages,
            'metadata' => $this->getMetadata(),
        ]);

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
    public function edit(Request $request, Document $document)
    {
        if ($request->user()->cannot('update', $request->user(), Document::class)) {
            abort(403);
        }

        //
        return Inertia::render('Documents/DocumentCreateOrEdit', [
            'document' => $document->toArray(),
            'messages' => [],
            'metadata' => $this->getMetadata(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDocumentRequest $request, Document $document)
    {
        // Grab the validated data from the request.
        $validated = $request->safe()->only([
            'name', 'area_id', 'discipline_id', 'is_placeholder', 'revision_id', 'status_id', 'tags', 'type_id', 'description'
        ]);

        // If a document number is not set, then generate one to be set.
        if (isset($document->id) && !isset($document->document_number)) {
            $number = self::generate($validated);
        }

        // Updates the document with the new details.
        $updated = $document->update([
            'name' => $validated['name'] ?? null,
            'description' => $validated['description'] ?? null,
            'document_status_id' => $validated['status_id'] ?? null,
            'discipline_id' => $validated['discipline_id'] ?? null,
            'type_id' => $validated['type_id'] ?? null,
            'area_id' => $validated['area_id'] ?? null,
            'revision_id' => $validated['revision_id'] ?? null,
            'document_number' => $number ?? $document->document_number ?? null
        ]);

        $messages = [];
        if (isset($document->id)) {
            $messages['success'] = 'Document updated successfully';
        } else {
            $messages['error'] = 'An error occurred, please try again';
        }

        return Inertia::render('Documents/DocumentCreateOrEdit', [
            'document' => $document->toArray(),
            'messages' => $messages,
            'metadata' => $this->getMetadata(),
        ]);
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
    private function getDocuments(array $params = []): array
    {
        $query = Document::query();

        if (\Auth::user()->hasRole('super')) {
            // Remove the global scope for super admins.
            $query->withoutGlobalScope(OrganisationScope::class);
            if (isset($params['search'])) {
                $query->where(function ($subquery) use ($params) {
                    $subquery->where('name', 'like', "%{$params['search']}%")->orWhere('document_number', 'like', "%{$params['search']}%");
                    return $subquery;
                });
            }

            // If the discipline filter is set.
            if (isset($params['discipline']) && $params['discipline'] !== 'all') {
                $query->where(function($sub) use ($params) {
                    return $sub->where('discipline_id', '=', $params['discipline']);
                });
            }

            return $query->get()->load('discipline', 'area', 'type', 'document_status', 'revision', 'latestActivity', 'latestActivity.user')->toArray();
        }

        /**
         * Build the query for non super users (Admins & Users).
         */
        $query->where('organisation_id', \Auth::user()->organisation_id);
        
        if (isset($params['search'])) {
            $query->where(function ($subquery) use ($params) {
                return $subquery->where('name', 'like', "%{$params['search']}%")->orWhere('document_number', 'like', "%{$params['search']}%");
            });
        }

        if (isset($params['discipline']) && $params['discipline'] !== 'all') {
            $query->where(function($sub) use ($params) {
                return $sub->where('discipline_id', '=', $params['discipline']);
            });
        }
        return $query->get()->load('discipline', 'area', 'type', 'document_status', 'revision', 'latestActivity', 'latestActivity.user')->toArray() ?? [];
    }

    /**
     * Returns the basic metadata for the application.
     *
     * @return array|null
     */
    private function getMetadata(): ?array
    {
        if (\Auth::user()->hasRole('super')) {
            return [
                'areas' => \App\Models\Area::withoutGlobalScope(OrganisationScope::class)->get(['id', 'organisation_id', 'name']) ?? [],
                'disciplines' => \App\Models\Discipline::withoutGlobalScope(OrganisationScope::class)->get(['id', 'organisation_id', 'name']) ?? [],
                'types' => \App\Models\Type::withoutGlobalScope(OrganisationScope::class)->get(['id', 'organisation_id', 'name']) ?? [],
                'document_statuses' => \App\Models\DocumentStatus::withoutGlobalScope(OrganisationScope::class)->get(['id', 'organisation_id', 'name']) ?? [],
                'revisions' => \App\Models\Revision::withoutGlobalScope(OrganisationScope::class)->orderBy('weight', 'asc')->get(['id', 'organisation_id', 'name']) ?? [],
            ];
        }

        $org_id = \Auth::user()->organisation_id ?? false;
        if (!$org_id) {
            return [];
        }

        /**
         * Return metadata.
         */
        return [
            'areas' => \App\Models\Area::where('organisation_id', $org_id)->get(['id', 'organisation_id', 'name']) ?? [],
            'disciplines' => \App\Models\Discipline::where('organisation_id', $org_id)->get(['id', 'organisation_id', 'name']) ?? [],
            'types' => \App\Models\Type::where('organisation_id', $org_id)->get(['id', 'organisation_id', 'name']) ?? [],
            'document_statuses' => \App\Models\DocumentStatus::where('organisation_id', $org_id)->get(['id', 'organisation_id', 'name']) ?? [],
            'revisions' => \App\Models\Revision::where('organisation_id', $org_id)->orderBy('weight', 'asc')->get(['id', 'organisation_id', 'name']) ?? [],
        ];
    }
}
