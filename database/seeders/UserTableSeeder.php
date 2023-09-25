<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            [ 
                'name' => 'Josette Biyo',
                'email' => 'jtbiyo@sei.dost.gov.ph',
                'password' => Hash::make('password')
            ],
            [ 
                'name' => 'Liezl de Lara',
                'email' => 'lmdelara@sei.dost.gov.ph',
                'password' => Hash::make('password')
            ],
            [ 
                'name' => 'Madelyn Recio',
                'email' => 'mprecio@sei.dost.gov.ph',
                'password' => Hash::make('password')
            ],
            [ 
                'name' => 'Jemmalyn Miniao',
                'email' => 'jcminiao@sei.dost.gov.ph',
                'password' => Hash::make('password')
            ],
            [ 
                'name' => 'Jason Yangco',
                'email' => 'jsyangco@sei.dost.gov.ph',
                'password' => Hash::make('password')
            ],
            [ 
                'name' => 'Joana Teresa Medina',
                'email' => 'jymedina@sei.dost.gov.ph',
                'password' => Hash::make('password')
            ],
            [ 
                'name' => 'Susana Esquivel',
                'email' => 'sfesquivel@sei.dost.gov.ph',
                'password' => Hash::make('password')
            ],
            [ 
                'name' => 'Maria Elena Constantino-Agbuis',
                'email' => 'mcagbuis@sei.dost.gov.ph',
                'password' => Hash::make('password')
            ],
            [ 
                'name' => 'Mary Ann Manila',
                'email' => 'mamanila@sei.dost.gov.ph',
                'password' => Hash::make('password')
            ],
            [ 
                'name' => 'Marren Joy Belgado-Aquino',
                'email' => 'mjbelgadoaquino@sei.dost.gov.ph',
                'password' => Hash::make('password')
            ],
            [ 
                'name' => 'Jobelle Gayas',
                'email' => 'jpgayas@sei.dost.gov.ph',
                'password' => Hash::make('password')
            ],
        ]);
    }
}
