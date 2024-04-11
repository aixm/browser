<?php

namespace App\Models;

use App\Enums\ParseStatus;
use App\Traits\Paginatable;
use App\Traits\Searchable;
use App\Traits\WithRequests;
use App\Traits\ProcessRelations;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;


abstract class AixmGraphModel extends Model
{
    use HasFactory, WithRequests, Paginatable, ProcessRelations, Searchable;

    /**
     * Guarded fields
     *
     * @var string[]
     */
    protected $guarded = ['id'];

    /**
     * Searchable fields
     *
     * @var string[]
     */
    public $searchable = [];

    /**
     * Cast dates in models
     *
     * @var string[]
     */
    protected $casts = [
        'deleted_at' => 'datetime:Y-m-d H:i:s',
        'created_at' => 'datetime:Y-m-d H:i:s',
        'updated_at' => 'datetime:Y-m-d H:i:s',
        'time' => 'datetime:Y-m-d H:i:s',
        'status' => ParseStatus::class
    ];

}
