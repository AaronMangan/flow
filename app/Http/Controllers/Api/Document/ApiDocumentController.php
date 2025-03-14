<?php

namespace App\Http\Controllers\Api\Document;

use App\Http\Controllers\Controller;
use App\Models\Document;
use Illuminate\Http\Request;

class ApiDocumentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Authorize the action
        if ($request->user()->cannot('viewAny', Document::class)) {
            abort(403);
        }

        // Start query
        $query = Document::query();
        $query->with('revision', 'document_status');
        // Check if a search param has been provided, and if it has search and return documents using that value.
        if ($request->has('search') && isset($request->search) && !empty($request->search)) {
            $query->where(function ($q) use ($request) {
                return $q->where('name', 'like', "%{$request->search}%")
                    ->orWhere('document_number', 'like', "%{$request->search}%");
            });
        }

        // Return a response.
        return response()->json([
            'data' => $query->get()->toArray()
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
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
