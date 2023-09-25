<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AttribDetails extends Model
{
    use HasFactory;

    protected $primaryKey = 'attrib_id';

    protected $fillable = [
        'attrib_number',
        'attrib_year',
        'attrib_responsible_unit',
        'attrib_planned_budget',
        'attrib_actual_budget',
        'attrib_class',
        'attrib_source',
        'attrib_source_code',
        'status'
    ];
}
