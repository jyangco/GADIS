<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AnnexBAgendas extends Model
{
    use HasFactory;

    protected $primaryKey = 'agenda_id';

    protected $fillable = [
        'an_id',
        'agenda_year',
        'agenda_target',
        'agenda_budget',
        'agenda_budget_for'
    ];

    public function agenda_activities(){
        return $this->hasMany(AnnexBAgendaActivities::class, 'agenda_id');
    }
}
