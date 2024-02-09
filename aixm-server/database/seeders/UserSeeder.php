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

        User::factory()->create([
            'first_name'=>'Eduard',
            'last_name'=>'POROSNICU',
            'email' => 'eduard.porosnicu@eurocontrol.int',
            'role' => 'admin',
            'company' => 'Eurocontrol',
            'position' =>'Senior Technical/Administrativ'
        ]);

        User::factory()->create([
            'first_name'=>'Teodors',
            'last_name'=>'Polurezovs',
            'email' => 'teodors.polurezovs@lgs.lv',
            'role' => 'user',
            'company' => 'Aeronautical Information Service of Latvia',
            'position' =>'Senior AIM environment administrator'
        ]);

        $userCount = 0;

        // other users
        User::factory()->count($userCount)->create();
    }
}
