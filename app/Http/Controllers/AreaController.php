<?php

namespace App\Http\Controllers;

use App\Models\Area;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\Areas\StoreAreaRequest;

class AreaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        /**
         * Return the rendered view.
         */
        return Inertia::render('Meta/ViewAreas', [
            'areas' => $this->getAreas()
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
    public function store(StoreAreaRequest $request)
    {
        // Get the data
        $data = $request->safe()->only(['name', 'code', 'description']);
        $data['user_id'] = $request->user()->id;
        $data['organisation_id'] = $request->user()->organisation_id;
        $area = Area::create($data);

        return Inertia::render('Meta/ViewAreas', [
            'areas' => $this->getAreas()
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Area $area)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Area $area)
    {
        //

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreAreaRequest $request, Area $area)
    {
        // Get the data.
        $data = $request->safe()->only(['name', 'code', 'description', 'draft']);

        // Update the status
        $result = $area->update($data);

        return Inertia::render('Meta/ViewAreas', [
            'areas' => $this->getAreas()
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Area $area)
    {
        if (!$request->user()->hasAnyRole(['super', 'admin'])) {
            abort(401, 'Unauthorised');
        }

        // Otherwise, delete the discipline.
        $area->delete();

        return response('Area deleted successfully', 200);
    }

    private function getAreas(): array
    {
        $query = Area::query();

        if (\Auth::user()->hasRole('super')) {
            return $query->get()->toArray();
        }

        return $query->where('organisation_id', \Auth::user()->organisation_id)
            ->get()->toArray() ?? [];
    }
}
