<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProfileTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('user_profiles')->insert([
            [ 
                'user_id' => '1',
                'position_id' => '1' 
            ],
            [ 
                'user_id' => '2',
                'position_id' => '2' 
            ],
            [ 
                'user_id' => '3',
                'position_id' => '3' 
            ],
            [ 
                'user_id' => '4',
                'position_id' => '4' 
            ],
            [ 
                'user_id' => '5',
                'position_id' => '4' 
            ],
            [ 
                'user_id' => '6',
                'position_id' => '4' 
            ],
            [ 
                'user_id' => '7',
                'position_id' => '4' 
            ],
            [ 
                'user_id' => '8',
                'position_id' => '4' 
            ],
            [ 
                'user_id' => '9',
                'position_id' => '4' 
            ],
            [ 
                'user_id' => '10',
                'position_id' => '4' 
            ],
            [ 
                'user_id' => '11',
                'position_id' => '4' 
            ],
        ]);
    }
}
