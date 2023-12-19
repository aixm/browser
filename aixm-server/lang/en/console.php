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

    'asm' => [
        'install' => [
            'description' => 'Install ASM Backend System',
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
            'description' => 'Update ASM Backend System',
            'info' => [
                'done' => 'Update ASM is completed',
            ],
        ],
    ],
];
