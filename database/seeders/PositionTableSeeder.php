<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PositionTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('positions')->insert([
            [ 
                'position_name' => 'Executive Committee Chair',
            ],
            [ 
                'position_name' => 'TWG Chair',
            ],
            [ 
                'position_name' => 'GAD Secretariat',
            ],
            [ 
                'position_name' => 'GAD Staff',
            ],
        ]);
    }
}
