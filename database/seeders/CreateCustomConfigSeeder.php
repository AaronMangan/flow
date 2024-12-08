<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Config;
use App\Models\Organisation;
use Illuminate\Support\Str;

class CreateCustomConfigSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        Organisation::all()->map(function ($org) {
            Config::create([
                'name' => 'S3 Bucket',
                'values' => [
                    'region' => 'ap4',
                    'bucket_name' => "bucket-{$org->name}",
                    'token' => Str::random(40),
                ],
                'organisation_id' => $org->id
            ]);
        });
    }
}
