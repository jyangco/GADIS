<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActivityBeneficiaries extends Model
{
    use HasFactory;

    protected $primaryKey = 'ben_id';

    protected $fillable = [
        'act_id',
        'act_target',
        'p_beneficiary_value',
        'p_beneficiary_target',
        'a_beneficiary_value',
        'a_beneficiary_target',
    ];
}
