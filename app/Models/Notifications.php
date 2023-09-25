<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notifications extends Model
{
    use HasFactory;

    protected $primaryKey = 'notif_id';

    protected $fillable = [
        'notif_title',
        'notif_body',
        'profile_to',
        'profile_from',
        'id_number',
        'path',
        'isViewed',
    ];
}
