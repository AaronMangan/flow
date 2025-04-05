<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TransmittalAcknowledgement extends Model
{
    // Fillable attributes.
    protected $fillable = [
        'transmittal_id', 'signature', 'acknowledged_by', 'status_id'
    ];

    public function transmittal(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Transmittal::class);
    }
}
