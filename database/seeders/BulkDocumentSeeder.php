<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Document;
use App\Traits\MetadataLibrary;

class BulkDocumentSeeder extends Seeder
{
    use MetadataLibrary;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $documents = Document::factory()->count(50)->make();
    }
}
