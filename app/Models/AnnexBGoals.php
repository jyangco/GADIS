<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AnnexBGoals extends Model
{
    use HasFactory;

    protected $primaryKey = 'ab_goal_id';

    protected $fillable = [
        'ab_id',
        'goal_id',
    ];

    public function agenda(){
        return $this->hasMany(AnnexBAgendaNumber::class, 'ab_goal_id');
    }

    public function contents(){
        return $this->hasMany(AnnexBAgendaContent::class, 'ab_goal_id');
    }
}
