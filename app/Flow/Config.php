<?php

namespace App\Flow;

use Illuminate\Support\Arr;

class Config
{
    /**
     * Returns a config value for the user.
     *
     * @param string $key
     * @return void
     */
    public static function getConfigValue(string $key)
    {
        // User can only return configs for their organisation.
        if (!\Auth::check()) {
            throw new \Exception('User not authenticated', 404);
        }

        // Get user organisation id.
        $org_id = \Auth::user()->organisation_id ?? false;

        // Pull the config records for the org.
        // This will collapse all separate arrays into one.
        $configs = \App\Models\Config::orgConfig();

        // Check, using dot notation, that a config key exists.
        if (Arr::hasAny($configs, $key)) {
            return Arr::get($configs, $key);
        }

        // If not found, return false.
        return false;
    }
}
