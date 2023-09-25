<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AnnexB extends Model
{
    use HasFactory;

    protected $primaryKey = 'ab_id';

    protected $fillable = [
        'aa_id',
    ];

    public function goals(){
        return $this->hasMany(AnnexBGoals::class, 'ab_id');
    }
}
