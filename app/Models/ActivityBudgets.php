<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActivityBudgets extends Model
{
    use HasFactory;

    protected $primaryKey = 'budget_id';

    protected $fillable = [
        'act_id',
        'planned_budget',
        'actual_budget',
    ];

    public function act_abreakdowns(){
        return $this->hasMany(BudgetBreakdown::class, 'budget_id');
    }
}
