<?php

namespace Database\Seeders;

use App\Models\Auth\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // admin user
        User::factory()->create([
            'email' => 'admin@aixm.com',
            'role' => 'admin'
        ]);
        User::factory()->create([
            'email' => 'user@aixm.com',
            'role' => 'user'
        ]);

        $userCount = 30;

        // other users
        User::factory()->count($userCount)->create();
    }
}
