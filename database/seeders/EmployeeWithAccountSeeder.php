<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EmployeeWithAccountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('employee_with_account')->insert([
            [
                "user_id" => 1, //Dr. Biyo
                "employee_id" => 28,
            ],
            [
                "user_id" => 2, //de Lara
                "employee_id" => 51,
            ],
            [
                "user_id" => 3, //Recio
                "employee_id" => 131,
            ],
            [
                "user_id" => 4, //Miniao-Saga
                "employee_id" => 109,
            ],
            [
                "user_id" => 5, //Yangco
                "employee_id" => 165,
            ],
            [
                "user_id" => 6, //Medina
                "employee_id" => 107,
            ],
            [
                "user_id" => 7, //Esquivel
                "employee_id" => 68,
            ],
            [
                "user_id" => 8, //Agbuis
                "employee_id" => 2,
            ],
            [
                "user_id" => 9, //Manila
                "employee_id" => 104,
            ],
            [
                "user_id" => 10, //Belgado-Aquino
                "employee_id" => 24,
            ],
            [
                "user_id" => 11, //Gayas
                "employee_id" => 78,
            ],
            [
                "user_id" => 12, //Udag
                "employee_id" => 154,
            ],
            [
                "user_id" => 13, //Vistan
                "employee_id" => 162,
            ],
            [
                "user_id" => 15, //Malaki
                "employee_id" => 102,
            ],
        ]);
    }
}
