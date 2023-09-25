<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ResPub extends Model
{
    use HasFactory;
    
    protected $primaryKey = 'respub_id';

    protected $fillable = [
        'file_type',
        'file_category',
        'file_subcategory',
        'file_title',
        'file_name',
        'file_thumbnail',
        'issuance_year'
    ];
}
