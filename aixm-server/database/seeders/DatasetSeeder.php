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
            'name' => 'BD 2023-03-20 AIXM 5',
            'filename' => 'BD_2023-03-20.aixm5.xml',
            'content_type' => 'application/xml',
            'path' => 'samples',
            'description' => '30Mb sample AIXM 5 xml file'
        ]);



        // parse datasets
        $datasets = Dataset::all();
        foreach ($datasets as $dataset) {
            $dataset->parse();
        }
    }
}
