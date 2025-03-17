<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Transmittal;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicTransmittalController extends Controller
{
    public function show(Request $request)
    {
        if (!$request->hasValidSignature()) {
            abort(401);
        }

        // Return the view.
        return Inertia::render('Public/ViewTransmittal', [
            'transmittal' => $this->getTransmittal($request->id),
            'expiry_days' => $request->user()->organisation->config()->where('key', 'organisation_settings')->first()->values['transmittal_expiry_days'] ?? 14
        ]);
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
