<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserRoleTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('user_roles')->insert([
            [ 
                'user_id' => '1',
                'user_role' => 'user' ,
                'isTWG' => 0
            ],
            [ 
                'user_id' => '2',
                'user_role' => 'admin' ,
                'isTWG' => 1
            ],
            [ 
                'user_id' => '3',
                'user_role' => 'admin' ,
                'isTWG' => 1
            ],
            [ 
                'user_id' => '4',
                'user_role' => 'admin' ,
                'isTWG' => 1
            ],
            [ 
                'user_id' => '5',
                'user_role' => 'admin' ,
                'isTWG' => 0
            ],
            [ 
                'user_id' => '6',
                'user_role' => 'user' ,
                'isTWG' => 1
            ],
            [ 
                'user_id' => '7',
                'user_role' => 'user' ,
                'isTWG' => 1
            ],
            [ 
                'user_id' => '8',
                'user_role' => 'user' ,
                'isTWG' => 1
            ],
            [ 
                'user_id' => '9',
                'user_role' => 'user' ,
                'isTWG' => 1
            ],
            [ 
                'user_id' => '10',
                'user_role' => 'user' ,
                'isTWG' => 1
            ],
            [ 
                'user_id' => '11',
                'user_role' => 'user' ,
                'isTWG' => 1
            ],
        ]);
    }
}
