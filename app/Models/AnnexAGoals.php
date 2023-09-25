<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AnnexAGoals extends Model
{
    use HasFactory;

    protected $primaryKey = 'goal_id';

    protected $fillable = [
        'aa_id',
        'goal_index',
        'GAD_goal'
    ];

    public function annexBGoals(){
        return $this->hasOne(AnnexBGoals::class, 'goal_id');
    }
}
