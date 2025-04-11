<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Area;
use App\Models\Discipline;
use App\Traits\LogsActivity;
use App\Models\Scopes\OrganisationScope;
use Illuminate\Database\Eloquent\Attributes\ScopedBy;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

#[ScopedBy([OrganisationScope::class])]
class Document extends Model
{
    use LogsActivity;
    use HasFactory;

    /**
     * Fillable properties, these can be manipulated by user actions (i.e. forms)
     *
     * @var array
     */
    protected $fillable = [
        'name', 'description', 'user_id', 'organisation_id', 'document_status_id', 'discipline_id', 'type_id', 'area_id', 'revision_id', 'document_number'
    ];

    /**
     * Returns the tags associated with the document instance.
     *
     * @return void
     */
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class);
    }

    /**
     * Returns the area associated with the document.
     *
     * @return void
     */
    public function area()
    {
        return $this->hasOne(\App\Models\Area::class, 'id', 'area_id');
    }

    /**
     * Returns the Discipline associated with the document.
     *
     * @return void
     */
    public function discipline()
    {
        return $this->hasOne(\App\Models\Discipline::class, 'id', 'discipline_id');
    }

    /**
     * Returns the type associated with the document.
     *
     * @return void
     */
    public function type()
    {
        return $this->hasOne(\App\Models\Type::class, 'id', 'type_id');
    }

    /**
     * Returns the revision related to the document.
     *
     * @return void
     */
    public function revision()
    {
        return $this->hasOne(\App\Models\Revision::class, 'id', 'revision_id');
    }

    /**
     * Returns the document status related to the document.
     *
     * @return void
     */
    public function document_status()
    {
        return $this->hasOne(\App\Models\DocumentStatus::class, 'id', 'document_status_id');
    }

    /**
     * Return all transmittals that a document belongs to.
     *
     * @return void
     */
    public function transmittals(): BelongsToMany
    {
        return $this->belongsToMany(\App\Models\Transmittal::class) ?? null;
    }
}
