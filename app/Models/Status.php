<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Attributes\ScopedBy;

class Status extends Model
{
    use SoftDeletes;
    use LogsActivity;

    /**
     * Deleted Status.
     */
    public const DELETED = 3;

    /**
     * Fillables.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'description', 'organisation_id', 'type'
    ];
}
