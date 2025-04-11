<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transmittal;
use App\Models\TransmittalAcknowledgement as TxAck;
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
        $request->user()->has_signature = isset($validated['signature']) ?? false;
        $saved = $request->user()->save();

        return response()->json([
            'status' => $saved ? 'success' : 'fail',
            'message' => $saved ? 'Signature was saved successfully!' : 'An error occurred, please contact your administrator'
        ], $saved ? 200 : 500);
    }

    public function acknowledgeTransmittal(Request $request, Transmittal $transmittal)
    {
        $messages = [];
        // Check the user can perform the action.
        if (!$request->user()->hasAnyRole(['super', 'admin']) || !isset($transmittal->id)) {
            abort(403);
        }

        // Get user & signature (make visible)
        $user = $request->user()->makeVisible('signature');

        // Create acknowledgement for transmittal
        $created = TxAck::create([
            'transmittal_id' => $transmittal->id,
            'signature' => $user->signature ?? null,
            'acknowledged_by' => $user->id,
            'status_id' => 1
        ]);

        if ($created) {
            $transmittal->acknowledged_at = now();
            $transmittal->save();
            $messages['success'][] = "Transmittal acknowledged successfully";
        }

        return response()->json([
            'status' => $created ? 'success' : 'fail',
            'messages' => $messages
        ]);
    }
}
