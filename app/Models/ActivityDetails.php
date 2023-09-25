<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActivityDetails extends Model
{
    use HasFactory;

    protected $primaryKey = 'act_id';

    protected $fillable = [
        'act_year',
        'act_category',
        'act_type',
        'act_gad_mandate',
        'act_cause_of_issue',
        'act_gad_objective',
        'act_relevant_org',
        'act_responsible_unit',
        'act_expense_class',
        'act_source',
        'act_source_code',
        'status'
    ];

    public function act_atitles(){
        return $this->hasMany(ActivityTitles::class, 'act_id');
    }

    public function act_abens(){
        return $this->hasMany(ActivityBeneficiaries::class, 'act_id');
    }

    public function act_abudgets(){
        return $this->hasOne(ActivityBudgets::class, 'act_id');
    }

    // public function act_atrainings(){
    //     return $this->hasOne(Trainings::class, 'act_id');
    // }
}
