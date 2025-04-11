<?php

namespace App\Traits;

trait MetadataLibrary
{
    /**
     * An array of models that are used to generate data.
     */
    protected const LIBRARY = [
        'areas' => [
            'aliases' => ['area', 'project'],
            'model' => \App\Models\Area::class,
            'with' => [],
        ],
        'disciplines' => [
            'aliases' => ['discipline'],
            'model' => \App\Models\Discipline::class,
            'with' => [],
        ],
        'types' => [
            'aliases' => ['type'],
            'model' => \App\Models\Type::class,
            'with' => [],
        ],
        'document_statuses' => [
            'aliases' => ['status'],
            'model' => \App\Models\DocumentStatus::class,
            'with' => [],
        ],
        'tags' => [
            'aliases' => ['tag'],
            'model' => \App\Models\Tag::class,
            'with' => [],
        ],
        'revisions' => [
            'aliases' => ['rev', 'revision'],
            'model' => \App\Models\Revision::class,
            'with' => [],
        ],
        'users' => [
            'aliases' => ['user'],
            'model' => \App\Models\User::class,
            'with' => [],
        ],
    ]; 

    /**
     * Used to get a random entry for the provided metadata item (supplied by key).
     *
     * @param string $key Based on the library above. Returns a random entry of the selected metadata.
     * @return array|null The random metadata entry, serialized to an array
     */
    public static function selectMetadata(string $key = ''): ?array
    {
        /* Fetch the library entry based on the key provided */
        $entry = (array_key_exists($key, self::LIBRARY)) 
            /* If the key matches a key in the array, return it. */
            ? self::LIBRARY[$key]
            
            /* The supplied key doesn't exist in the array, check if it is an alias of one of the keys. */
            : collect(self::LIBRARY)
                ->mapWithKeys(function ($meta, $strKey) {
                    $keys = array_merge([$strKey], $meta['aliases']);
                    return collect($keys)->mapWithKeys(fn($alias) => [$alias => $meta]);
                })->get($key) ?? [];
        
        /* In case an entry was not found */
        if (!isset($entry) || empty($entry) || !isset($entry['model'])) {
            return [];
        }

        /* Begin a query */
        $query = $entry['model']::query();

        /* Return a random entry from the selected metadata */
        return $query->inRandomOrder()->first()->toArray();
    }
}
