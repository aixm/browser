<?php

namespace App\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Str;

class WithScope implements Scope
{
    /**
     * Apply the scope to a given Eloquent query builder.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $builder
     * @param  \Illuminate\Database\Eloquent\Model  $model
     * @return void
     */
    public function apply(Builder $builder, Model $model)
    {
        $with = [];
        $params = Str::of(Request::input('with'))->explode(',');
        foreach ($params as $w) {
            if (Str::contains($w, '.')
                && strtolower(class_basename($model)) === Str::before($w, '.')
                && method_exists($model, Str::after($w, '.'))
                ) {
                $with[] = Str::after($w, '.');
            }
        }
        $builder->with($with);
    }
}
