<?php

namespace App\Http\Controllers;

use App\Models\Type;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\Types\StoreTypeRequest;

class TypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        /**
         * Return the rendered view.
         */
        return Inertia::render('Meta/ViewTypes', [
            'types' => $this->getTypes()
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
    public function store(StoreTypeRequest $request)
    {
        // Get the data
        $data = $request->safe()->only(['name', 'code', 'description']);
        $data['user_id'] = $request->user()->id;
        $data['organisation_id'] = $request->user()->organisation_id;
        $type = Type::create($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(Type $type)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Type $type)
    {
        //

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreTypeRequest $request, Type $type)
    {
        // Get the data.
        $data = $request->safe()->only(['name', 'code', 'description', 'draft']);

        // Update the status
        $result = $type->update($data);

        return Inertia::render('Meta/ViewDocumentStatuses', [
            'statuses' => $this->getTypes()
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Type $type)
    {
        if (!$request->user()->hasAnyRole(['super', 'admin'])) {
            abort(401, 'Unauthorised');
        }

        // Otherwise, delete the discipline.
        $type->delete();

        return response('Type deleted successfully', 200);
    }

    private function getTypes(): array
    {
        $query = Type::query();

        if (\Auth::user()->hasRole('super')) {
            return $query->get()->toArray();
        }

        return $query->where('organisation_id', \Auth::user()->organisation_id)
            ->get()->toArray() ?? [];
    }
}
