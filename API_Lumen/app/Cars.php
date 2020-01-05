<?php

namespace App;

use Illuminate\Database\Eloquent\Model;


class Cars extends Model
{
    protected $table = 'vehicles';

    protected $fillable = [
        'name', 'description', 'model', 'date'
    ];

    protected $casts = [
        'date' => 'Timestamp'
    ];

    public $timestamps = false;


}
