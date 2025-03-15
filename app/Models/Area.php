<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\LogsActivity;

class Area extends Model
{
    use LogsActivity;

    protected $fillable = [
        'name', 'code', 'description', 'user_id', 'organisation_id'
    ];

    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    public function organisation()
    {
        return $this->belongsTo(\App\Models\Organisation::class);
    }
}
