<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AnnexBAgendaContent extends Model
{
    use HasFactory;

    protected $primaryKey = 'ac_id';

    protected $fillable = [
        'ab_goal_id',
        'gender_issue',
        'result',
        'indicator',
        'baseline',
        'responsible_office'
    ];
}
