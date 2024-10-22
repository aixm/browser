<?php

namespace App\Models\Aixm;

use App\Models\AixmGraphModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Property extends AixmGraphModel
{
    ##################################################################################
    # Relations
    ##################################################################################
    public function feature()
    {
        return $this->belongsTo(Feature::class);
    }
    public function ref_feature()
    {
        return $this->belongsTo(Feature::class, 'ref_feature_id');
    }
    ##################################################################################
    # Scopes
    ##################################################################################

    ##################################################################################
    # Functions
    ##################################################################################
    public static function getProperty($property_name, $feature_id=0) {
        return Property::where([
            ['feature_id', '=', $feature_id],
            ['name', '=', $property_name]
        ])->first();
    }
}
