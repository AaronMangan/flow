<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Scopes\OrganisationScope;
use Illuminate\Database\Eloquent\Attributes\ScopedBy;

#[ScopedBy([OrganisationScope::class])]
class ActivityLog extends Model
{
    protected $fillable = [
        'model_name', 'model_id', 'event', 'data', 'user_id', 'organisation_id'
    ];

    /**
     * Return the user that created the event.
     *
     * @return BelongsTo|null
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    protected $casts = [
        'data' => 'array'
    ];

    /**
     * MorphTo Relationship.
     *
     * @return void
     */
    public function model()
    {
        return $this->belongsTo($this->model_name, 'model_id');
    }
}
