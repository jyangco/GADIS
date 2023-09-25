<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class sddReport extends Model
{
    use HasFactory;

    protected $primaryKey = 'sdd_id';

    protected $fillable = [
        'male',
        'female',
        'total',
        'region',
        'province',
        'type',
        'year'
    ];
}
