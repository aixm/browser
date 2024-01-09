<?php

namespace App\Models;

use App\Traits\Paginatable;
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
    use HasFactory, WithRequests, Paginatable, ProcessRelations;

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
        'time' => 'datetime:Y-m-d H:i:s'
    ];

    ##################################################################################
    # Scopes
    ##################################################################################
    public function scopeSearch(Builder $query): void
    {
        if (Request::input('search')) {
            $search = Str::of(Request::input('search'));
            $count = count($this->searchable);
            for ($i = 0; $i < $count; $i++) {
                if ($i == 0) {
                    $query->where($this->searchable[$i], 'ilike', "%" . $search . "%");
                } else {
                    $query->orWhere($this->searchable[$i], 'ilike', "%" . $search . "%");
                }
            }
        }
    }

}
