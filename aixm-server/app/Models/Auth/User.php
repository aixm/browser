<?php

namespace App\Models\Auth;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Models\Aixm\Dataset;
use App\Traits\Paginatable;
use App\Traits\ProcessRelations;
use App\Traits\Searchable;
use App\Traits\WithRequests;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, WithRequests, Paginatable, ProcessRelations, Searchable;

    protected $fillable = [
        'active',
        'email',
        'first_name',
        'last_name',
        'role',
        'company',
        'position',
        'active_at'
    ];

    public $searchable = [
        'active',
        'email',
        'first_name',
        'last_name',
        'role',
        'company',
        'position'
    ];

    protected $hidden = [
        'password',
    ];

    ##################################################################################
    # Relations
    ##################################################################################
    public function datasets()
    {
        return $this->hasMany(Dataset::class);
    }

    ##################################################################################
    # Scopes
    ##################################################################################

    ##################################################################################
    # Functions
    ##################################################################################
    public function isAdmin() {
        return $this->role === 'admin';
    }

    public function updateActivityTimestamp() {
        $this->update(['active_at' => now(), 'updated_at' => false]);
    }
}
