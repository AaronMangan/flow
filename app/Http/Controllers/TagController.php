<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\Tags\StoreTagRequest;

class TagController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        /**
         * Return the rendered view.
         */
        return Inertia::render('Meta/ViewTags', [
            'tags' => $this->getTags()
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
    public function store(StoreTagRequest $request)
    {
        // Get the data
        $data = $request->safe()->only(['name', 'code', 'description']);
        $data['user_id'] = $request->user()->id;
        $data['organisation_id'] = $request->user()->organisation_id;
        $tag = Tag::create($data);

        return Inertia::render('Meta/ViewTags', [
            'tags' => $this->getTags()
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Tag $tag)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Tag $tag)
    {
        //

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreTagRequest $request, Tag $tag)
    {
        // Get the data.
        $data = $request->safe()->only(['name', 'code', 'description', 'draft']);

        // Update the status
        $result = $tag->update($data);

        return Inertia::render('Meta/ViewTags', [
            'tags' => $this->getTags()
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Tag $tag)
    {
        if (!$request->user()->hasAnyRole(['super', 'admin'])) {
            abort(401, 'Unauthorised');
        }

        // Otherwise, delete the discipline.
        $tag->delete();

        return response('Tag deleted successfully', 200);
    }

    private function getTags(): array
    {
        $query = Tag::query();

        if (\Auth::user()->hasRole('super')) {
            return $query->get()->toArray();
        }

        return $query->where('organisation_id', \Auth::user()->organisation_id)
            ->get()->toArray() ?? [];
    }
}
