<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\LogsActivity;
use Illuminate\Database\Eloquent\SoftDeletes;

class DocumentStatus extends Model
{
    use LogsActivity;
    use SoftDeletes;

    //
    protected $fillable = [
        'code', 'name', 'description', 'draft', 'user_id', 'organisation_id'
    ];
}
