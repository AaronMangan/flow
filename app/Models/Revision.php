<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Scopes\OrganisationScope;
use Illuminate\Database\Eloquent\Attributes\ScopedBy;

#[ScopedBy([OrganisationScope::class])]
class Revision extends Model
{
    use SoftDeletes;
    use LogsActivity;

    // Properties of the model that can be set by users, through forms, etc
    protected $fillable = [
        'name', 'code', 'description', 'draft', 'organisation_id', 'user_id', 'weight'
    ];

    protected $casts = [
        'draft' => 'boolean'
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
