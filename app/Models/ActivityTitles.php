<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActivityTitles extends Model
{
    use HasFactory;

    protected $primaryKey = 'title_id';

    protected $fillable = [
        'act_id',
        'act_title',
    ];
}
