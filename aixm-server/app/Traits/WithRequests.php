<?php

namespace App\Traits;

use App\Scopes\WithScope;

trait WithRequests
{
    protected static function bootWithRequests()
    {
        static::addGlobalScope(new WithScope());
    }
}
