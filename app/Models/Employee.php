<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    protected $primaryKey = 'employee_id';

    protected $fillable = [
        'employee_fname',
        'employee_lname',
        'employee_division',
        'employee_status',
        'employee_gender',
        'employee_sex',
    ];
}
