<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BudgetBreakdown extends Model
{
    use HasFactory;

    protected $primaryKey = 'bb_id';

    protected $fillable = [
        'budget_id',
        'item',
        'item_cost',
    ];
}
