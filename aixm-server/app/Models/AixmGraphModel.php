<?php

namespace App\Models;

use App\Traits\Paginatable;
use App\Traits\WithRequests;
use App\Traits\ProcessRelations;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Request as RequestAlias;

abstract class AixmGraphModel extends Model
{
    use HasFactory, WithRequests, Paginatable, ProcessRelations;

    /**
     * Guarded fields
     *
     * @var string[]
     */
    protected $guarded = ['id'];

    /**
     * Cast dates in models
     *
     * @var string[]
     */
    protected $casts = [
        'deleted_at' => 'datetime:Y-m-d H:i:s',
        'created_at' => 'datetime:Y-m-d H:i:s',
        'updated_at' => 'datetime:Y-m-d H:i:s',
        'time' => 'datetime:Y-m-d H:i:s'
    ];

}
