<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
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
        'status_id'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $append = ['token'];

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
        ];
    }

    public function status()
    {
        return $this->belongsTo(\App\Models\Status::class);
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
        // return JWTAuth::fromUser($this);
        return new Attribute(
            get: fn () => 'yes',
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
