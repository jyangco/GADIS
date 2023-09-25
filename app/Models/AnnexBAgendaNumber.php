<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AnnexBAgendaNumber extends Model
{
    use HasFactory;

    protected $primaryKey = 'an_id';

    protected $fillable = [
        'ab_goal_id',
    ];

    public function agenda_contents(){
        return $this->hasMany(AnnexBAgendas::class, 'an_id');
    }
}
