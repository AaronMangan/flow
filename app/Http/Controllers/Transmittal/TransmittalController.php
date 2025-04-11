<?php

namespace App\Http\Controllers\Transmittal;

use App\Models\Transmittal;
use App\Models\Document;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Transmittals\CreateTransmittalRequest;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\URL;
use App\Models\Config;
use App\Mail\SendTransmittalEmail;
use Illuminate\Support\Facades\Mail;

class TransmittalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Authorize the action.
        if ($request->user()->cannot('viewAny', Transmittal::class)) {
            abort(403);
        }

        // Return
        return Inertia::render('Transmittals/TransmittalIndex', [
            'transmittals' => $this->getTransmittals($request->all()),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        // Check that the user can create a transmittal. If not, then abort the request.
        if ($request->user()->cannot('create', Transmittal::class)) {
            abort(403);
        }

        // Return the transmittal index.
        return Inertia::render('Transmittals/CreateTransmittal', [
            'transmittals' => $this->getTransmittals($request->all()),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateTransmittalRequest $request)
    {
        // Authorize the action.
        if ($request->user()->cannot('create', Transmittal::class)) {
            abort(403);
        }

        // Fetch the validated data.
        $validated = $request->safe()->only(['to', 'details', 'documents', 'transmittal_status']);

        // Create a new collection out of the data in the to field.
        $toCollection = collect($validated['to']);

        // Separate users and emails using partition...
        [$toUsers, $toEmails] = $toCollection->partition(fn ($item) => isset($item['type']) && $item['type'] === 'user');

        // Get user emails from the database...
        $userEmails = User::whereIn('id', $toUsers->pluck('value'))->pluck('email');

        // Combine both user emails and directly provided emails...
        $allEmails = $userEmails->merge($toEmails->pluck('value'))->flatten();

        // Create the transmittal.
        $created = Transmittal::create([
            'to' => $allEmails ?? [],
            'details' => $validated['details'] ?? null,
            'organisation_id' => $request->user()->organisation_id ?? null,
            'status_id' => $validated['transmittal_status'] ?? null,
        ]);

        $documentsToSync = [];
        $docModels = Document::whereIn('id', $validated['documents'])->get();
        foreach ($validated['documents'] as $doc) {
            $data = $docModels->reject(function ($d) use ($doc) {
                return $d->id !== $doc ? true : false;
            })->values()->flatten()->toArray()[0];
            $documentsToSync[$doc] = [
                'revision_id' => $data['revision_id'],
                'status_id' => $data['document_status_id']
            ];
        }
        $created->documents()->sync($documentsToSync);

        return Inertia::render('Transmittals/TransmittalIndex', [
            'transmittals' => $this->getTransmittals(),
            'messages' => (isset($created->id)) ? [
                'success' => 'Transmittal created successfully'
            ] : [
                'error' => 'An error occurred creating transmittal'
            ]
        ]);
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

    /**
     * Get an index of transmittals, using an supplied filters.
     *
     * @param array $params
     * @return array
     */
    private function getTransmittals(array $params = []): array
    {
        $query = Transmittal::query();

        // Add filters where supplied.
        if (isset($params['to'])) {
            $query->where(function ($subquery) use ($params) {
                return $subquery->where('to', 'like', "%{$params['to']}%");
            });
        }

        // If the user is a super admin, return all documents.
        if (\Auth::user()->hasRole('super')) {
            return $query->withoutGlobalScope(\App\Models\Scopes\OrganisationScope::class)->get()->load('documents', 'status')->toArray();
        }

        // Otherwise, simply return the documents for that organisation.
        return $query->where('organisation_id', \Auth::user()->organisation_id)
            ->get()->load('documents', 'status')->toArray() ?? [];
    }

    /**
     * Send the transmittal to its intended recipients.
     *
     * @param Request $request
     * @param Transmittal $transmittal
     * @return void
     */
    public function send(Request $request, Transmittal $transmittal)
    {
        $transmittal = $transmittal->load('documents', 'documents.revision', 'documents.document_status');
        if (!isset($transmittal->id) || $transmittal->documents->count() <= 0 || !isset($transmittal->organisation_id) || !isset($transmittal->to)) {
            return Inertia::render('Transmittals/TransmittalIndex', [
                'transmittals' => $this->getTransmittals($request->all()),
                'messages' => [
                    'error' => 'An error occurred and the transmittal could not be issued. Please contact your administrator for support.'
                ]
            ]);
        }

        /* Get the limit of documents that are displayed on a transmittal */
        $config = Config::where('organisation_id', $transmittal->organisation_id)->where('key', 'organisation_settings')->first()->values;

        /* Prepare a details array, with information needed to prepare a transmittal */
        $details = [
            'to' => $transmittal->to ?? null,
            'addressee' => 'Document Controller',
            'body' => $transmittal->details ?? '',
            'from' => $config['email_from'] ?? $request->user()->email,
            'action' => [
                'url' => URL::temporarySignedRoute('view.transmittal', now()->addDays($config['transmittal_expiry_days'] ?? 14), ['id' => $transmittal->id]),
                'label' => 'View Transmittal'
            ],
            'limit' => $config['transmittal_email_limit'] ?? 50
        ];

        try {
            // Send the email. This will result in a truthy value, so to check it, use double-negation.
            $mailed = \Mail::to($details['to'])->send(new SendTransmittalEmail($details, $transmittal));

            $transmittal->sent_at = now();
            $transmittal->save();

            $messages = [];
            if (!!$mailed) {
                $messages['success'] = 'Transmittal was sent successfully';
            } else {
                $messages['error'] = 'An error occurred, please contact your administrator';
            }
            return response()->json([
                'status' => (!is_null($mailed)) ? 'success' : 'fail',
                'messages' => $messages
            ]);
        } catch (\Exception $ex) {
            throw $ex;
        }
    }
}
