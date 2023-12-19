<?php

namespace App\Models\Aixm;

use App\Models\AixmGraphModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Feature extends AixmGraphModel
{
    ##################################################################################
    # Relations
    ##################################################################################
    public function properties()
    {
        return $this->hasMany(Property::class);
    }

    ##################################################################################
    # Scopes
    ##################################################################################

    ##################################################################################
    # Functions
    ##################################################################################

    public static function getFeature($feature_name) {
        return Feature::where([['name', '=', $feature_name]])->with('properties')->first();
    }
}
