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
    public function index()
    {
        //
        return Inertia::render('Transmittals/IncomingTransmittalIndex', [
            'transmittals' => []
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
}
