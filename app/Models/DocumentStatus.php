<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\LogsActivity;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Scopes\OrganisationScope;
use Illuminate\Database\Eloquent\Attributes\ScopedBy;

#[ScopedBy([OrganisationScope::class])]
class DocumentStatus extends Model
{
    use LogsActivity;
    use SoftDeletes;

    //
    protected $fillable = [
        'code', 'name', 'description', 'draft', 'user_id', 'organisation_id'
    ];
}
