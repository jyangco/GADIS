<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AttribActsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('attrib_activities')->insert([
            [
                'attrib_title' => 'Undergraduate Scholarship Program'
            ],
            [
                'attrib_title' => 'Accelerated Science and Technology Human Resource Development Program'
            ],
            [
                'attrib_title' => 'Capacity Building Program in Science Education'
            ]
        ]);
    }
}
