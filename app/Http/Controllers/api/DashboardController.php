<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    // getting male and female employees
    public function getEmployeeNumber(){
        $male = DB::table('employees')->where([
            ['employee_sex', 'Male'],
        ])->count();
        $regular_male = DB::table('employees')->where([
            ['employee_sex', 'Male'],
            ['employee_status', 'Regular'],
        ])->count();
        $cos_male = DB::table('employees')->where([
            ['employee_sex', 'Male'],
            ['employee_status', 'COS'],
            ])->count();
        $regular_female = DB::table('employees')->where([
            ['employee_sex', 'Female'],
            ['employee_status', 'Regular'],
        ])->count();
        $cos_female = DB::table('employees')->where([
            ['employee_sex', 'Female'],
            ['employee_status', 'COS'],
        ])->count();
        $female = DB::table('employees')->where([
            ['employee_sex', 'Female']
        ])->count();
        return response()->json([
            'male' => $male,
            'male_breakdown' => [
                'regular' => $regular_male,
                'cos' => $cos_male,
            ],
            'female' => $female,
            'female_breakdown' => [
                'regular' => $regular_female,
                'cos' => $cos_female,
            ]
        ]);
    }

    //get employee sex by division
    public function getSexByDivision(){
        $M_OD = 0;
        $M_STSD = 0;
        $M_SEID = 0;
        $M_FAD = 0;
        $M_STMERPD = 0;
        $F_OD = 0;
        $F_STSD = 0;
        $F_SEID = 0;
        $F_FAD = 0;
        $F_STMERPD = 0;
        $employees = DB::table('employees')->get();
        foreach ($employees as $val) {
            if ($val->employee_sex == 'Male') {
                if ($val->employee_division == "OD") {
                    $M_OD = $M_OD + 1;
                } else if ($val->employee_division == "STSD") {
                    $M_STSD = $M_STSD + 1;
                }
                else if ($val->employee_division == "SEID") {
                    $M_SEID = $M_SEID + 1;
                }
                else if ($val->employee_division == "FAD") {
                    $M_FAD = $M_FAD + 1;
                }
                else if ($val->employee_division == "STMERPD") {
                    $M_STMERPD = $M_STMERPD + 1;
                }
            } else {
                if ($val->employee_division == "OD") {
                    $F_OD = $F_OD + 1;
                } else if ($val->employee_division == "STSD") {
                    $F_STSD = $F_STSD + 1;
                }
                else if ($val->employee_division == "SEID") {
                    $F_SEID = $F_SEID + 1;
                }
                else if ($val->employee_division == "FAD") {
                    $F_FAD = $F_FAD + 1;
                }
                else if ($val->employee_division == "STMERPD") {
                    $F_STMERPD = $F_STMERPD + 1;
                }
            }
        } 
        return response()->json([
            'male' => [
                $M_OD,
                $M_STSD,
                $M_SEID,
                $M_FAD,
                $M_STMERPD
            ],
            'female' => [
                $F_OD,
                $F_STSD,
                $F_SEID,
                $F_FAD,
                $F_STMERPD
            ]
        ]);
    }
}
