<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AnnexA extends Model
{
    use HasFactory;

    protected $primaryKey = 'aa_id';

    protected $fillable = [
        'start_year',
        'end_year',
        'GAD_vision',
        'GAD_mission',
        'status'
    ];

    public function annexB(){
        return $this->hasOne(AnnexB::class, 'aa_id');
    }

    public function goals(){
        return $this->hasMany(AnnexAGoals::class, 'aa_id');
    }
}
