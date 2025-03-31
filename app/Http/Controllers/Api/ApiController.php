<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Rules\Base64ImageRule as ImageRule;

class ApiController extends Controller
{
    public function saveSignature(request $request)
    {
        // Return a 422 response if there is no signature.
        if (!$request->has('signature') || !isset($request->signature)) {
            return response()->json([
                'status' => 'fail',
                'message' => 'Signature not provided'
            ], 422);
        }
        $validated = $request->validate([
            'signature' => ['nullable', 'string', new ImageRule()],
        ]);
        $request->user()->signature = $validated['signature'] ?? null;
        $saved = $request->user()->save();

        return response()->json([
            'status' => $saved ? 'success' : 'fail',
            'message' => $saved ? 'Signature was saved successfully!' : 'An error occurred, please contact your administrator'
        ], $saved ? 200 : 500);
    }
}
