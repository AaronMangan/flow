<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\DocumentStatus;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Transmittal extends Model
{
    //
    protected $fillable = [
        'to', 'details', 'organisation_id', 'status_id', 'sent_at'
    ];

    protected $casts = [
        'to' => 'array'
    ];

    public function documents()
    {
        return $this->belongsToMany(\App\Models\Document::class);
    }

    /**
     * Return the status that has been applied to the transmittal.
     * The transmittal status does not change the status of any attached documents, but provides information about that
     * intention of the transmittal.
     *
     * @return void
     */
    public function status(): HasOne
    {
        return $this->hasOne(\App\Models\DocumentStatus::class, 'id', 'status_id') ?? null;
    }
}
