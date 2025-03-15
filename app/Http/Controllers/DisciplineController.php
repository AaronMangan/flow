<?php

namespace App\Http\Controllers;

use App\Models\Discipline;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\Disciplines\StoreDisciplineRequest;

class DisciplineController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        /**
         * Return the rendered view.
         */
        return Inertia::render('Meta/ViewDisciplines', [
            'disciplines' => $this->getDisciplines()
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
    public function store(storeDisciplineRequest $request)
    {
        // Get the data
        $data = $request->safe()->only(['name', 'code', 'description']);
        $data['user_id'] = $request->user()->id;
        $data['organisation_id'] = $request->user()->organisation_id;
        $discipline = Discipline::create($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(Discipline $discipline)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Discipline $discipline)
    {
        //

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreDisciplineRequest $request, Discipline $discipline)
    {
        // Get the data.
        $data = $request->safe()->only(['name', 'code', 'description', 'draft']);

        // Update the status
        $result = $discipline->update($data);

        return Inertia::render('Meta/ViewDisciplines', [
            'statuses' => $this->getDisciplines()
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Discipline $discipline)
    {
        if (!$request->user()->hasAnyRole(['super', 'admin'])) {
            abort(401, 'Unauthorised');
        }

        // Otherwise, delete the discipline.
        $discipline->delete();

        return response('Discipline deleted successfully', 200);
    }

    private function getDisciplines(): array
    {
        $query = Discipline::query();

        if (\Auth::user()->hasRole('super')) {
            return $query->get()->toArray();
        }

        return $query->where('organisation_id', \Auth::user()->organisation_id)
            ->get()->toArray() ?? [];
    }
}
