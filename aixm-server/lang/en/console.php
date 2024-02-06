<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Logs Language Lines
    |--------------------------------------------------------------------------
    |
    | following language lines contain the default log messages
    | and messages used by createContext method in Log class.
    |
    */

    'aixm' => [
        'install' => [
            'description' => 'Install AIXM Backend System',
            'info' => [
                'database' => 'Create database structure',
            ],
            'confirm' => [
                'key' => 'Generate Application key?',
                'link' => 'Create storage link?',
                'seed' => 'Seed test data in Database?',
                'db' => 'Recreate Database structure?',
                'data' => 'All existing database data will be lost! Continue?',
            ],
        ],
        'update' => [
            'description' => 'Update AIXM Backend System',
            'info' => [
                'done' => 'Update AIXM is completed',
            ],
        ],
        'parse' => [
            'description' => 'Parse AIXM XML dataset file',
            'info' => [
                'done' => 'Parse AIXM XML dataset file is completed',
            ],
            'error' => [
                'file_not_exists' => 'XML dataset file is not exist',
            ],
            'input' => [
                'file' => [
                    'prompt' => 'Input file name with path to be parsed',
                    'example' => 'E.g. samples\2024-01-25\Route.xml'
                ]
            ],
        ],
    ],
];
