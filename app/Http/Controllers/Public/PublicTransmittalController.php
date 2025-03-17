<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Transmittal;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\URL;
use Carbon\Carbon;

class PublicTransmittalController extends Controller
{
    public function show(Request $request)
    {
        if (!$request->hasValidSignature() || !$request->has('id')) {
            abort(401);
        }

        // Return the view.
        return Inertia::render('Public/ViewTransmittal', [
            'transmittal' => $this->getTransmittal($request->id),
            'expiry_days' => $request->user()->organisation->config()->where('key', 'organisation_settings')->first()->values['transmittal_expiry_days'] ?? 14,
            'acknowledgement_url' => URL::signedRoute('acknowledge.transmittal', ['id' => $request->id]),
        ]);
    }

    public function acknowledge(Request $request)
    {
        // Ensure that the signature is valid and the request has an id.
        if (!$request->hasValidSignature() || !$request->has('id')) {
            abort(401);
        }

        $transmittal = Transmittal::find($request->id);
        $transmittal->acknowledged_at = Carbon::now();
        $transmittal->save();
    }

    /**
     * Return the transmittal.
     *
     * @param int $id
     * @return array|null
     */
    private function getTransmittal($id): ?array
    {
        $transmittal = Transmittal::with('documents', 'documents.document_status', 'documents.revision')->find($id)->toArray();
        $transmittal['reason'] = 'Issued For Construction';
        return $transmittal ?? [];
    }
}
