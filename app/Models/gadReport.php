<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class gadReport extends Model
{
    use HasFactory;
    protected $primaryKey = 'report_id';

    protected $fillable = [
        'report_year',
        'report_type',
        'total_budget',
        'activity_list',
        'status'
    ];

    protected $casts = [
        'activity_list' => 'array'
    ];
}
