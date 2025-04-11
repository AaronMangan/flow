<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Scopes\OrganisationScope;
use Illuminate\Database\Eloquent\Attributes\ScopedBy;

#[ScopedBy([OrganisationScope::class])]
class Tag extends Model
{
    protected $fillable = [
        'name', 'user_id', 'organisation_id',
    ];

    /**
     * The documents that are tagged with the tag.
     *
     * @return void
     */
    public function documents()
    {
        return $this->belongsToMany(Document::class);
    }
}
