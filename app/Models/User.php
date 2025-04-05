<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use Spatie\Permission\Models\Role;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Casts\Attribute;
use App\Traits\LogsActivity;
use App\Flow\Flow;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory;
    use Notifiable;
    use HasRoles;
    use SoftDeletes;
    use LogsActivity;
    use HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'organisation_id',
        'status_id',
        'signature',
        'has_signature',
    ];

    /**
     * Always include these relationships
     *
     * @var array
     */
    protected $with = ['organisation', 'status'];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'signature'
    ];

    /**
     * Appends these attributes.
     *
     * @var array
     */
    protected $appends = ['token', 'config'];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'has_signature' => 'boolean'
        ];
    }

    public function status()
    {
        return $this->belongsTo(\App\Models\Status::class) ?? null;
    }

    public function organisation()
    {
        return $this->belongsTo(\App\Models\Organisation::class);
    }

    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }

    public function history(): array
    {
        return Flow::historyOf(self::class, $this->id);
    }

    public function isSuper(): bool
    {
        return $this->hasRole('super') ? true : false;
    }

    public function getTokenAttribute(): Attribute
    {
        return new Attribute(
            get: fn () => 'yes',
        );
    }

    /**
     * Returns the users org config
     *
     * @return Attribute
     */
    public function config(): Attribute
    {
        return new Attribute(
            get: fn () => \App\Flow\Config::orgConfig() ?? [],
        );
    }

    /**
     * Return the JWT Identifier
     *
     * @return void
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return JWT Claims
     *
     * @return void
     */
    public function getJWTCustomClaims()
    {
        return [];
    }
}
