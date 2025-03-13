<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Area;
use App\Models\Discipline;

class Document extends Model
{
    protected $fillable = [
        'name', 'description', 'user_id', 'organisation_id', 'document_status_id', 'discipline_id', 'type_id', 'area_id', 'revision_id', 'document_number'
    ];
    //
    public function tags()
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

    public function documentNumber()
    {

    }
}
