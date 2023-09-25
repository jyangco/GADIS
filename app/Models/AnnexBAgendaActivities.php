<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AnnexBAgendaActivities extends Model
{
    use HasFactory;

    protected $primaryKey = 'aact_id';

    protected $fillable = [
        'agenda_id',
        'activity_title',
    ];
}
