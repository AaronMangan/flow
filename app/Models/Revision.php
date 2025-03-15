<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Revision extends Model
{
    use SoftDeletes;
    use LogsActivity;

    //
    protected $fillable = [
        'name', 'code', 'description', 'draft', 'organisation_id', 'user_id'
    ];

    /**
     * Return the user that created the revision.
     *
     * @return BelongsTo|null
     */
    public function user(): ?BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    /**
     * Return the organisation that the revision belongs to.
     *
     * @return BelongsTo|null
     */
    public function organisation(): ?BelongsTo
    {
        return $this->belongsTo(\App\Models\Organisation::class);
    }
}
