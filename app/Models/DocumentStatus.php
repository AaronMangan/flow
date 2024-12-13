<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\LogsActivity;

class DocumentStatus extends Model
{
    use LogsActivity;

    //
    protected $fillalble = [
        'code', 'name', 'description', 'draft',
    ];
}
