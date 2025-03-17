<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Transmittal;
use App\Models\Document;
use App\Models\Config;
use App\Mail\SendTransmittalEmail;
use Illuminate\Support\Facades\URL;
use Carbon\Carbon;

class SendTransmittal extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = '
        app:send-transmittal
            {--id= : The id of the transmittal to send}
    ';

    /**
     * Describes the command. This is displayed when a user lists the available commands.
     *
     * @var string
     */
    protected $description = 'Issue a specific transmittal, as provided by the id';

    /**
     * Sends the transmittal, to the listed recipients.
     */
    public function handle()
    {
        // Get the id of the transmittal from the command options.
        $id = $this->option('id') ?? false;
        if (!$id) {
            $this->error('Invalid id was supplied, please check and try again');
            return 0;
        }
        $transmittal = Transmittal::where('id', $id)->with('documents', 'documents.revision', 'documents.document_status')->first();
        if (!isset($transmittal->id) || $transmittal->documents->count() <= 0 || !isset($transmittal->organisation_id)) {
            $this->error('Transmittal not found or transmittal does not have documents');
            return 0;
        }

        /**
         * Update the transmittal sent at property.
         */
        Transmittal::withoutEvents(function () use ($id) {
            $tx = Transmittal::find($id);
            $tx->sent_at = Carbon::now()->format('y-m-d H:i:s');
            $tx->save();
        });

        /* Get the limit of documents that are displayed on a transmittal */
        // $limit = Config::where('organisation_id', $transmittal->organisation_id)->where('key', 'organisation_settings')->first()->values['transmittal_email_limit'] ?? 50;
        $config = Config::where('organisation_id', $transmittal->organisation_id)->where('key', 'organisation_settings')->first()->values;

        /* Prepare a details array, with information needed to prepare a transmittal */
        $details = [
            'to' => implode("; ", $transmittal->to),
            'addressee' => 'Document Controller',
            'body' => $transmittal->details ?? '',
            'from' => 'Flow Energy',
            'action' => [
                'url' => URL::temporarySignedRoute('view.transmittal', now()->addDays($config['transmittal_expiry_days'] ?? 14), ['id' => $id]),
                'label' => 'View Transmittal'
            ],
            'limit' => $config['transmittal_email_limit']
        ];

        try {
            // Send the email
            \Mail::to('azza.mangan@gmail.com')->send(new SendTransmittalEmail($details, $transmittal));
        } catch (\Exception $ex) {
            throw $ex;
        }
    }
}
