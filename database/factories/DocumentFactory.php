<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Traits\MetadataLibrary;
use App\Traits\GeneratesDocumentNumbers;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Document>
 */
class DocumentFactory extends Factory
{
    use MetadataLibrary;
    use GeneratesDocumentNumbers;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $user = self::selectMetadata('users') ?? [];
        $area = self::selectMetadata('areas') ?? [];
        $discipline = self::selectMetadata('disciplines') ?? [];
        $type = self::selectMetadata('types') ?? [];
        $revision = self::selectMetadata('revisions') ?? [];
        $status = self::selectMetadata('document_statuses') ?? [];

        if(!isset($user['id'])) {
            return [];
        }

        // Return the fields to create the new model.
        return [
            'name' => fake()->realText(fake()->numberBetween(15, 50)),
            'description' => fake()->realText(fake()->numberBetween(50, 120)),
            'user_id' => $user['id'] ?? null,
            'organisation_id' => $user['organisation_id'] ?? null,
            'document_status_id' => $status['id'] ?? null,
            'discipline_id' => $discipline['id'] ?? null,
            'type_id' => $type['id'] ?? null,
            'area_id' => $area['id'] ?? null,
            'revision_id' => $revision['id'] ?? null,
            'document_number' => (isset($area['id']) && isset($discipline['id']) && isset($type['id']))
                ? self::generate([
                    'area_id' => $area['id'],
                    'discipline_id' => $discipline['id'],
                    'type_id' => $type['id']
                ])
                : null,
        ];
    }
}
