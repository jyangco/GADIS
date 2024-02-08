<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EmployeeTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('employees')->insert([
            [
                "employee_fname" => "Carla",
                "employee_lname" => "Aganan",
                "employee_status" => "COS",
                "employee_division" => "STSD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Maria Elena",
                "employee_lname" => "Agbuis",
                "employee_status" => "Regular",
                "employee_division" => "STSD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Joyce Pearly",
                "employee_lname" => "Agna",
                "employee_status" => "COS",
                "employee_division" => "FAD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "William",
                "employee_lname" => "Alamag",
                "employee_status" => "COS",
                "employee_division" => "FAD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Vince",
                "employee_lname" => "Albuera",
                "employee_status" => "COS",
                "employee_division" => "FAD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Gilbert",
                "employee_lname" => "Ambac",
                "employee_status" => "COS",
                "employee_division" => "FAD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Anne Chiara",
                "employee_lname" => "Amponin",
                "employee_status" => "Regular",
                "employee_division" => "STSD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Fortunato",
                "employee_lname" => "Andaya",
                "employee_status" => "COS",
                "employee_division" => "FAD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Centelle",
                "employee_lname" => "Apellanes",
                "employee_status" => "COS",
                "employee_division" => "FAD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Kane Christian",
                "employee_lname" => "Aquino",
                "employee_status" => "COS",
                "employee_division" => "STSD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Bern Irish",
                "employee_lname" => "Arguelles",
                "employee_status" => "COS",
                "employee_division" => "STMERPD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Marjorie",
                "employee_lname" => "Ariola",
                "employee_status" => "COS",
                "employee_division" => "STSD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Kenneth",
                "employee_lname" => "Atienza",
                "employee_status" => "COS",
                "employee_division" => "STSD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Romnick James",
                "employee_lname" => "Atienza",
                "employee_status" => "COS",
                "employee_division" => "STMERPD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Bon David",
                "employee_lname" => "Bacuño",
                "employee_status" => "COS",
                "employee_division" => "STSD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Kim Dianne",
                "employee_lname" => "Bagasona",
                "employee_status" => "COS",
                "employee_division" => "FAD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Mark Gerard",
                "employee_lname" => "Bailon",
                "employee_status" => "COS",
                "employee_division" => "STMERPD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Sheena Mae",
                "employee_lname" => "Bala-oy",
                "employee_status" => "Regular",
                "employee_division" => "FAD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Timothy Gerard",
                "employee_lname" => "Baldemor",
                "employee_status" => "COS",
                "employee_division" => "SEID",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Ronell",
                "employee_lname" => "Barruga",
                "employee_status" => "COS",
                "employee_division" => "STSD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Glennise Shyra",
                "employee_lname" => "Bayking",
                "employee_status" => "Regular",
                "employee_division" => "STMERPD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Cielo Marie",
                "employee_lname" => "Bayson",
                "employee_status" => "COS",
                "employee_division" => "FAD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Regina",
                "employee_lname" => "Beleno",
                "employee_status" => "COS",
                "employee_division" => "OD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Marren Joy",
                "employee_lname" => "Belgado-Aquino",
                "employee_status" => "Regular",
                "employee_division" => "STMERPD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Maria Cristina",
                "employee_lname" => "Bermiso",
                "employee_status" => "Regular",
                "employee_division" => "OD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Wilcel James",
                "employee_lname" => "Bernardo",
                "employee_status" => "COS",
                "employee_division" => "STMERPD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Arles",
                "employee_lname" => "Bilale",
                "employee_status" => "COS",
                "employee_division" => "FAD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Josette",
                "employee_lname" => "Biyo",
                "employee_status" => "Regular",
                "employee_division" => "OD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Kenneth",
                "employee_lname" => "Boston",
                "employee_status" => "COS",
                "employee_division" => "STMERPD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Chabili",
                "employee_lname" => "Brabante",
                "employee_status" => "COS",
                "employee_division" => "STSD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Kenneth",
                "employee_lname" => "Brillantes",
                "employee_status" => "COS",
                "employee_division" => "STSD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Philip",
                "employee_lname" => "Bue",
                "employee_status" => "Regular",
                "employee_division" => "FAD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Ralfy",
                "employee_lname" => "Bulaclac",
                "employee_status" => "COS",
                "employee_division" => "FAD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Pamela Jane",
                "employee_lname" => "Cano",
                "employee_status" => "COS",
                "employee_division" => "STSD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Mark John Paul",
                "employee_lname" => "Capistrano",
                "employee_status" => "Regular",
                "employee_division" => "STMERPD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Jonathan",
                "employee_lname" => "Castañares",
                "employee_status" => "COS",
                "employee_division" => "STSD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Ramon David",
                "employee_lname" => "Castañeda",
                "employee_status" => "COS",
                "employee_division" => "STSD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "James Carlo",
                "employee_lname" => "Cerda",
                "employee_status" => "COS",
                "employee_division" => "SEID",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Efrel Jellian",
                "employee_lname" => "Cernias",
                "employee_status" => "COS",
                "employee_division" => "FAD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Dante",
                "employee_lname" => "Corral",
                "employee_status" => "COS",
                "employee_division" => "STSD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Aaron",
                "employee_lname" => "Cruz",
                "employee_status" => "COS",
                "employee_division" => "STSD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Camila Christian",
                "employee_lname" => "Cruz",
                "employee_status" => "COS",
                "employee_division" => "STMERPD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Daisylen",
                "employee_lname" => "Cruzat",
                "employee_status" => "COS",
                "employee_division" => "FAD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Arrasdi",
                "employee_lname" => "Culaban",
                "employee_status" => "COS",
                "employee_division" => "FAD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Kristine Lean",
                "employee_lname" => "Cura",
                "employee_status" => "COS",
                "employee_division" => "FAD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Faith Junessa",
                "employee_lname" => "Cureg",
                "employee_status" => "COS",
                "employee_division" => "FAD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Marielle Jane",
                "employee_lname" => "Curioso",
                "employee_status" => "COS",
                "employee_division" => "FAD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Julie Anne",
                "employee_lname" => "Cusi",
                "employee_status" => "Regular",
                "employee_division" => "OD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "John Rey",
                "employee_lname" => "Dalit",
                "employee_status" => "COS",
                "employee_division" => "STSD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Rodelio",
                "employee_lname" => "De Asis",
                "employee_status" => "Regular",
                "employee_division" => "SEID",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Liezl",
                "employee_lname" => "De Lara",
                "employee_status" => "Regular",
                "employee_division" => "OD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Jhan Jhan",
                "employee_lname" => "De Vera",
                "employee_status" => "Regular",
                "employee_division" => "STSD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Justin",
                "employee_lname" => "Del Rosario",
                "employee_status" => "COS",
                "employee_division" => "STMERPD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Gerald",
                "employee_lname" => "Dela Cruz",
                "employee_status" => "COS",
                "employee_division" => "OD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Ida",
                "employee_lname" => "Dela Peña",
                "employee_status" => "COS",
                "employee_division" => "STSD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Susan",
                "employee_lname" => "Dela Peña",
                "employee_status" => "Regular",
                "employee_division" => "FAD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Quintin",
                "employee_lname" => "Dela Torre",
                "employee_status" => "COS",
                "employee_division" => "FAD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Michael",
                "employee_lname" => "Delos Santos",
                "employee_status" => "COS",
                "employee_division" => "FAD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Ma. Daisy",
                "employee_lname" => "Demoni",
                "employee_status" => "Regular",
                "employee_division" => "STSD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Pamela Faye",
                "employee_lname" => "Dimas",
                "employee_status" => "COS",
                "employee_division" => "FAD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Mary Joy",
                "employee_lname" => "Dioneda",
                "employee_status" => "COS",
                "employee_division" => "FAD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Nona",
                "employee_lname" => "Docor",
                "employee_status" => "COS",
                "employee_division" => "FAD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Reynulfo",
                "employee_lname" => "Dolotina",
                "employee_status" => "Regular",
                "employee_division" => "FAD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Kimberly Ann",
                "employee_lname" => "Egalin",
                "employee_status" => "COS",
                "employee_division" => "STMERPD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Raymund",
                "employee_lname" => "Embang",
                "employee_status" => "COS",
                "employee_division" => "FAD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Aaron",
                "employee_lname" => "Esguerra",
                "employee_status" => "COS",
                "employee_division" => "STMERPD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Lawrence",
                "employee_lname" => "Español",
                "employee_status" => "COS",
                "employee_division" => "STSD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Susana",
                "employee_lname" => "Esquivel",
                "employee_status" => "Regular",
                "employee_division" => "STSD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Marilu",
                "employee_lname" => "Famor",
                "employee_status" => "COS",
                "employee_division" => "STSD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Josephine",
                "employee_lname" => "Feliciano",
                "employee_status" => "Regular",
                "employee_division" => "SEID",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Maria Lourdes",
                "employee_lname" => "Felicitas",
                "employee_status" => "Regular",
                "employee_division" => "SEID",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Janine",
                "employee_lname" => "Florendo",
                "employee_status" => "COS",
                "employee_division" => "STSD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Romil",
                "employee_lname" => "Flores",
                "employee_status" => "COS",
                "employee_division" => "FAD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Abygail",
                "employee_lname" => "Floro",
                "employee_status" => "COS",
                "employee_division" => "FAD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Ma. Alyssa Bianca",
                "employee_lname" => "Galban",
                "employee_status" => "COS",
                "employee_division" => "STSD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Ma. Rochelle",
                "employee_lname" => "Garcia",
                "employee_status" => "COS",
                "employee_division" => "STSD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Peter Gerry",
                "employee_lname" => "Gavina",
                "employee_status" => "Regular",
                "employee_division" => "STSD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Jobelle",
                "employee_lname" => "Gayas",
                "employee_status" => "Regular",
                "employee_division" => "SEID",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Cynthia",
                "employee_lname" => "Gayya",
                "employee_status" => "Regular",
                "employee_division" => "SEID",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Angelica",
                "employee_lname" => "Gonzales",
                "employee_status" => "COS",
                "employee_division" => "STSD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Anita",
                "employee_lname" => "Gorgonio",
                "employee_status" => "Regular",
                "employee_division" => "FAD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Clyde",
                "employee_lname" => "Guerrero",
                "employee_status" => "COS",
                "employee_division" => "STSD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Wilbert",
                "employee_lname" => "Guerrero",
                "employee_status" => "COS",
                "employee_division" => "FAD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Carizza",
                "employee_lname" => "Guevarra",
                "employee_status" => "COS",
                "employee_division" => "FAD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Karla",
                "employee_lname" => "Hernandez",
                "employee_status" => "Regular",
                "employee_division" => "STSD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Marjorie",
                "employee_lname" => "Hernandez",
                "employee_status" => "Regular",
                "employee_division" => "FAD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Camille Jeanne",
                "employee_lname" => "Huliganga",
                "employee_status" => "COS",
                "employee_division" => "STSD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Zamora",
                "employee_lname" => "Ibrahim",
                "employee_status" => "COS",
                "employee_division" => "STSD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Maricel",
                "employee_lname" => "Idos",
                "employee_status" => "COS",
                "employee_division" => "STSD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Ma. Cristina Mae",
                "employee_lname" => "Ilaw",
                "employee_status" => "Regular",
                "employee_division" => "STMERPD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Jasmin Coleen",
                "employee_lname" => "Intia",
                "employee_status" => "Regular",
                "employee_division" => "STMERPD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Armie",
                "employee_lname" => "Jackson",
                "employee_status" => "COS",
                "employee_division" => "FAD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Javier Angelo",
                "employee_lname" => "Javier",
                "employee_status" => "COS",
                "employee_division" => "STMERPD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Francis Dheylle",
                "employee_lname" => "Jiongco",
                "employee_status" => "COS",
                "employee_division" => "FAD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Aira Shaine",
                "employee_lname" => "Juarez",
                "employee_status" => "COS",
                "employee_division" => "STMERPD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Anna Patricia",
                "employee_lname" => "Lapuz",
                "employee_status" => "Regular",
                "employee_division" => "FAD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Charilyn Joy",
                "employee_lname" => "Layus",
                "employee_status" => "Regular",
                "employee_division" => "STSD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Bethel",
                "employee_lname" => "Legaspi",
                "employee_status" => "COS",
                "employee_division" => "FAD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Joel",
                "employee_lname" => "Lomugdang",
                "employee_status" => "COS",
                "employee_division" => "FAD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Edwin",
                "employee_lname" => "Lopez",
                "employee_status" => "COS",
                "employee_division" => "STSD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Aiza",
                "employee_lname" => "Macaraig",
                "employee_status" => "COS",
                "employee_division" => "OD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "John Albert",
                "employee_lname" => "Malaki",
                "employee_status" => "COS",
                "employee_division" => "OD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Karen Kaye",
                "employee_lname" => "Maneclang",
                "employee_status" => "COS",
                "employee_division" => "FAD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Mary Ann",
                "employee_lname" => "Manila",
                "employee_status" => "Regular",
                "employee_division" => "FAD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Geraldine",
                "employee_lname" => "Marfil",
                "employee_status" => "Regular",
                "employee_division" => "FAD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Albert",
                "employee_lname" => "Mariño",
                "employee_status" => "Regular",
                "employee_division" => "OD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Joana Teresa",
                "employee_lname" => "Medina",
                "employee_status" => "Regular",
                "employee_division" => "FAD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Jasmine Fay",
                "employee_lname" => "Mijares",
                "employee_status" => "COS",
                "employee_division" => "SEID",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Jemmalyn",
                "employee_lname" => "Miniao-Saga",
                "employee_status" => "Regular",
                "employee_division" => "OD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Mary Jane",
                "employee_lname" => "Montañez",
                "employee_status" => "COS",
                "employee_division" => "STSD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Rose Jean",
                "employee_lname" => "Morillo",
                "employee_status" => "COS",
                "employee_division" => "SEID",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Janette",
                "employee_lname" => "Namocatcat",
                "employee_status" => "COS",
                "employee_division" => "STSD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Ma. Nerissa",
                "employee_lname" => "Nicolas",
                "employee_status" => "Regular",
                "employee_division" => "STSD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Angelo Carlo",
                "employee_lname" => "Nisola",
                "employee_status" => "COS",
                "employee_division" => "STSD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Casylyn",
                "employee_lname" => "Noble",
                "employee_status" => "Regular",
                "employee_division" => "STMERPD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Gaius Karl",
                "employee_lname" => "Noble",
                "employee_status" => "Regular",
                "employee_division" => "STMERPD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Shaira Cel",
                "employee_lname" => "Padre",
                "employee_status" => "COS",
                "employee_division" => "STSD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Donalee",
                "employee_lname" => "Paez",
                "employee_status" => "COS",
                "employee_division" => "FAD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Mary Angelica",
                "employee_lname" => "Palomo",
                "employee_status" => "Regular",
                "employee_division" => "SEID",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Charlot",
                "employee_lname" => "Panal",
                "employee_status" => "Regular",
                "employee_division" => "FAD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Ma. Angiela",
                "employee_lname" => "Panganiban",
                "employee_status" => "COS",
                "employee_division" => "STSD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Justine Shaira",
                "employee_lname" => "Papa",
                "employee_status" => "COS",
                "employee_division" => "FAD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Love Joy",
                "employee_lname" => "Pascua",
                "employee_status" => "Regular",
                "employee_division" => "SEID",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "John Jemuel",
                "employee_lname" => "Pelipada",
                "employee_status" => "COS",
                "employee_division" => "SEID",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Ma. Connie",
                "employee_lname" => "Prianes",
                "employee_status" => "COS",
                "employee_division" => "STMERPD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "John Robert",
                "employee_lname" => "Punzalan",
                "employee_status" => "COS",
                "employee_division" => "STMERPD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Brent Gaylord",
                "employee_lname" => "Rabang",
                "employee_status" => "COS",
                "employee_division" => "SEID",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Lorena",
                "employee_lname" => "Rabino",
                "employee_status" => "COS",
                "employee_division" => "STMERPD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "John Paul",
                "employee_lname" => "Ramos",
                "employee_status" => "Regular",
                "employee_division" => "FAD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Vergel",
                "employee_lname" => "Rebuta",
                "employee_status" => "Regular",
                "employee_division" => "STMERPD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Madelyn",
                "employee_lname" => "Recio",
                "employee_status" => "COS",
                "employee_division" => "OD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Jose Naxiel",
                "employee_lname" => "Resolis",
                "employee_status" => "COS",
                "employee_division" => "FAD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Robby",
                "employee_lname" => "Reyes",
                "employee_status" => "Regular",
                "employee_division" => "STSD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Alona",
                "employee_lname" => "Rivera-Gasis",
                "employee_status" => "COS",
                "employee_division" => "STSD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Raprence",
                "employee_lname" => "Rosas",
                "employee_status" => "COS",
                "employee_division" => "STSD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Julian",
                "employee_lname" => "Rubis",
                "employee_status" => "COS",
                "employee_division" => "STMERPD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Ruben",
                "employee_lname" => "Salac",
                "employee_status" => "COS",
                "employee_division" => "FAD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Sheryll Lee",
                "employee_lname" => "Sales",
                "employee_status" => "Regular",
                "employee_division" => "STSD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Jeza Mae",
                "employee_lname" => "Salgado",
                "employee_status" => "COS",
                "employee_division" => "FAD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Monira",
                "employee_lname" => "Samaupan",
                "employee_status" => "Regular",
                "employee_division" => "SEID",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Elijah Daniel",
                "employee_lname" => "Sanchez",
                "employee_status" => "COS",
                "employee_division" => "FAD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Ma. Grace",
                "employee_lname" => "Sasota",
                "employee_status" => "Regular",
                "employee_division" => "STSD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Randolf",
                "employee_lname" => "Sasota",
                "employee_status" => "Regular",
                "employee_division" => "STMERPD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Dixie Heidel",
                "employee_lname" => "Sonico",
                "employee_status" => "COS",
                "employee_division" => "STSD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Patricia Ann",
                "employee_lname" => "Sopena",
                "employee_status" => "COS",
                "employee_division" => "FAD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Levita",
                "employee_lname" => "Tarnate",
                "employee_status" => "COS",
                "employee_division" => "FAD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Michael",
                "employee_lname" => "Telesforo",
                "employee_status" => "Regular",
                "employee_division" => "SEID",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Sharamae",
                "employee_lname" => "Torres-Co",
                "employee_status" => "Regular",
                "employee_division" => "STSD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Juan Antonio",
                "employee_lname" => "Tuazon",
                "employee_status" => "Regular",
                "employee_division" => "STMERPD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Celsa",
                "employee_lname" => "Tulalian",
                "employee_status" => "COS",
                "employee_division" => "STSD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Dante",
                "employee_lname" => "Tulalian",
                "employee_status" => "COS",
                "employee_division" => "FAD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Berna Jane",
                "employee_lname" => "Tumbali",
                "employee_status" => "COS",
                "employee_division" => "FAD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "France Chesca",
                "employee_lname" => "Turda",
                "employee_status" => "COS",
                "employee_division" => "SEID",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Alexander",
                "employee_lname" => "Udag",
                "employee_status" => "COS",
                "employee_division" => "OD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "April",
                "employee_lname" => "Valdez",
                "employee_status" => "Regular",
                "employee_division" => "SEID",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Cathleen Mary",
                "employee_lname" => "Velasquez",
                "employee_status" => "COS",
                "employee_division" => "FAD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Ian Mark",
                "employee_lname" => "Villa",
                "employee_status" => "COS",
                "employee_division" => "STMERPD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Rolyen",
                "employee_lname" => "Villamin",
                "employee_status" => "COS",
                "employee_division" => "STSD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Belmor",
                "employee_lname" => "Villamor",
                "employee_status" => "COS",
                "employee_division" => "FAD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Ma. Kiah",
                "employee_lname" => "Villamor",
                "employee_status" => "COS",
                "employee_division" => "STSD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Karen Louise",
                "employee_lname" => "Villas",
                "employee_status" => "Regular",
                "employee_division" => "STMERPD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "John Christopher",
                "employee_lname" => "Vistan",
                "employee_status" => "COS",
                "employee_division" => "OD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Maria Angelica",
                "employee_lname" => "Vistan",
                "employee_status" => "COS",
                "employee_division" => "OD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Romelyn",
                "employee_lname" => "Yamio",
                "employee_status" => "COS",
                "employee_division" => "STMERPD",
                "employee_sex" => "Female"
            ],
            [
                "employee_fname" => "Jason",
                "employee_lname" => "Yangco",
                "employee_status" => "COS",
                "employee_division" => "OD",
                "employee_sex" => "Male"
            ],
            [
                "employee_fname" => "Liberty Len",
                "employee_lname" => "Yusores",
                "employee_status" => "Regular",
                "employee_division" => "FAD",
                "employee_sex" => "Female"
            ]
        ]);
    }
}
