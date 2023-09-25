<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ppaFile extends Model
{
    use HasFactory;
    protected $primaryKey = 'pf_id';

    protected $fillable = [
        'ppa_id',
        'ppa_file_title',
        'ppa_file_path'
    ];
}
