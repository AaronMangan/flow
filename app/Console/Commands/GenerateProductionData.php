<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Config;
use App\Models\Organisation;

class GenerateProductionData extends Command
{
    /**
     * These are keys that are required for each organisation.
     *
     * @var array
     */
    protected $requiredKeys = [
        'transmittal_statuses' => [
            'name' => 'Transmittal Statuses',
            'key' => 'transmittal_statuses',
            'values' => [
                [
                    'id' => 1,
                    'name' => 'Unsent',
                ],
                [
                    'id' => 2,
                    'name' => 'Sent'
                ],
                [
                    'id' => 3,
                    'name' => 'Acknowledged'
                ]
            ]
        ],
        'organisation_settings' => [
            'name' => '',
            'key' => 'organisation_settings',
            'values' => [
                "tags" => true,
                "areas" => true,
                "types" => true,
                "disciplines" => true,
                "document_number_schema" => "{area}{separator}{discipline}{separator}{type}{separator}{index}",
                "document_number_separator" => "-",
                "document_number_index_format" => "/\\d{5}$/"
            ]
        ]
    ];

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = '
        app:generate-production-data
        {--id=}
    ';

    /**
     * Generates the necessary items required for production.
     *
     * @var string
     */
    protected $description = 'Generate any applicable data required for production.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $id = $this->option('id') ?? null;

        // Make sure we have an id
        if (!isset($id) || empty($id) || is_null($id)) {
            $this->error('Please provide an id with the the "--id=?" option');
            return 0;
        }

        //
        $organisation = Organisation::find($id);

        if (!isset($organisation->id) || is_null($organisation)) {
            $this->error('Organisation with supplied id was not found.');
            return 0;
        }

        foreach ($this->requiredKeys as $keyToCheck => $values) {
            $this->generateConfig($organisation, $keyToCheck);
        }
    }

    /**
     * Check if the transmittal statuses exist, and generate them if not.
     *
     * @param Organisation $organisation
     * @param string $key
     * @return integer|null
     */
    private function generateConfig(Organisation $organisation, string $key): ?int
    {
        // Make sure a valid key is provided.
        if (!in_array($key, array_keys($this->requiredKeys))) {
            $this->error('Key was not found');
            return 0;
        }

        $hasTransmittalStatuses = (Config::where('organisation_id', $organisation->id)->where('key', $key)->count() > 0) ? true : false;

        if (!$hasTransmittalStatuses) {
            $data = $this->requiredKeys[$key];
            $data['organisation_id'] = $organisation->id;
            $data['values'] = $data['values'];
            Config::withoutEvents(function () use ($data) {
                Config::create($data);
            });
            $this->line("{$key} was created successfully");
        } else {
            $this->comment("{$key} already exists");
        }
        return 1;
    }
}
