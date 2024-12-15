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
        $configs = self::orgConfig();

        // Check, using dot notation, that a config key exists.
        if (Arr::hasAny($configs, $key)) {
            return Arr::get($configs, $key);
        }

        // If not found, return false.
        return false;
    }

    /**
     * Return the configuration data for an organisation.
     *
     * @return array
     */
    public static function orgConfig(): array
    {
        if (!\Auth::check()) {
            throw new \Exception('User not authenticated', 404);
        }

        // Get user organisation id.
        $org_id = \Auth::user()->organisation_id ?? false;

        // This will collapse all separate arrays into one.
        return Arr::collapse(\Auth::user()->organisation->config()->pluck('values')->toArray()) ?? [];
    }

    /**
     * Populate a string with placeholders, using data from a supplied array.
     * Returns false if the template string still contains placeholders afterwards.
     *
     * @param string $template
     * @param array $data
     * @return string|false
     */
    public static function replacePlaceholders(string $template, array $data): string|false
    {
        // Loop through each key in the $data array
        foreach ($data as $key => $value) {
            // Check to make sure there are no values that are null
            if (!isset($value) || empty($value) || !Arr::isAssoc($data) || Arr::isList($data)) {
                throw new \Exception('Placeholder population failed, please contact your administrator');
            }

            // Check if the placeholder exists in the template
            if (preg_match('/\{' . preg_quote($key, '/') . '\}/', $template)) {
                // Replace the placeholder with its corresponding value
                $template = preg_replace('/\{' . preg_quote($key, '/') . '\}/', $value, $template);
            }
        }

        // After all replacements, check if there are any remaining placeholders
        if (preg_match('/\{[a-zA-Z0-9_]+\}/', $template)) {
            // Return false if any placeholder still exists
            return false;
        }

        // Return the fully replaced template.
        return $template ?? false;
    }
}
