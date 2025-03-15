<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\LogsActivity;
use App\Models\Config;
use App\Models\User;

class Organisation extends Model
{
    use SoftDeletes;
    use LogsActivity;

    //
    protected $fillable = [
        'name', 'address', 'phone', 'settings'
    ];

    /**
     * Return the users for this organisation.
     *
     * @return HasMany|null
     */
    public function users(): ?HasMany
    {
        return $this->hasMany(User::class, 'organisation_id', 'id');
    }

    /**
     * Return any custom config options for the organisation.
     *
     * @return HasMany|null
     */
    public function config(): ?HasMany
    {
        return $this->hasMany(Config::class, 'organisation_id', 'id');
    }

    public function document_statuses()
    {
        return $this->hasMany(\App\Models\DocumentStatus::class, 'organisation_id', 'id');
    }

    public function disciplines()
    {
        return $this->hasMany(\App\Models\Disciplines::class, 'organisation_id', 'id');
    }
}
