<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AttribActivities extends Model
{
    use HasFactory;

    protected $primaryKey = 'attrib_title_id';

    protected $fillable = [
        'attrib_title'
    ];

    public function attrib_adetails(){
        return $this->hasMany(AttribDetails::class,'attrib_number');
    }

}
