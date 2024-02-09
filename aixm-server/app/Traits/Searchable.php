<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Str;

trait Searchable
{
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
