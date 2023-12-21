<?php

namespace App\Models\Aixm;

use App\Models\AixmGraphModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DatasetFeatureProperty extends AixmGraphModel
{
    ##################################################################################
    # Relations
    ##################################################################################
    public function dataset_feature()
    {
        return $this->belongsTo(DatasetFeature::class);
    }

    public function parent_dataset_property()
    {
        return $this->belongsTo(DatasetFeatureProperty::class, 'parent_id');
    }

    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    ##################################################################################
    # Scopes
    ##################################################################################

    ##################################################################################
    # Functions
    ##################################################################################
}
