<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'event_id',
        'name',
        'email',
        'password',
        'phone_number',
        'npwp',
        'address',
        'institution',
        'max_class',
        'max_test',
        'access_rights',
        'last_login_at',
        'last_logout_at',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

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
            'last_login_at' => 'datetime',
            'last_logout_at' => 'datetime',
            'access_rights' => 'array',
        ];
    }

    public function getIsAdminAttribute()
    {
        return $this->role === 'admin';
    }

    public function event()
    {
        return $this->belongsTo(Event::class, 'event_id');
    }

    public function businessEntities()
    {
        return $this->hasMany(BusinessEntity::class);
    }
}
