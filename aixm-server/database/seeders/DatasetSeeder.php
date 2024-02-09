<?php

namespace Database\Seeders;

use App\Models\Aixm\Dataset;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatasetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Dataset::create([
            'name' => 'Donlon',
            'filename' => 'Donlon.xml',
            'content_type' => 'application/xml',
            'path' => 'samples',
            'description' => 'Donlon test AIXM 5 xml file'
        ]);

        Dataset::create([
            'name' => 'Donlon 2022',
            'filename' => 'Donlon2022.xml',
            'content_type' => 'application/xml',
            'path' => 'samples',
            'description' => 'Donlon 2022 test AIXM 5 xml file'
        ]);

        Dataset::create([
            'name' => 'Latvian AIP 21 MAR 24',
            'filename' => 'EV_AIP_DS_FULL_20240321_AIRAC.xml',
            'content_type' => 'application/xml',
            'path' => 'samples',
            'description' => '~50Mb LGS AIXM xml real data'
        ]);



        // parse datasets
        $datasets = Dataset::all();
        foreach ($datasets as $dataset) {
            $dataset->parse();
        }
    }
}
