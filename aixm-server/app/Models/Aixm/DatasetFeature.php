<?php

namespace App\Models\Aixm;

use App\Models\AixmGraphModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class DatasetFeature extends AixmGraphModel
{
    // add additional attributes to the array
    protected $appends = ['associated_features_count', 'descendant_features_count', 'descendant_features'];

    ##################################################################################
    # Relations
    ##################################################################################
    public function dataset()
    {
        return $this->belongsTo(Dataset::class);
    }
    public function feature()
    {
        return $this->belongsTo(Feature::class);
    }
    public function dataset_feature_properties()
    {
        return $this->hasMany(DatasetFeatureProperty::class);
    }

    ##################################################################################
    # Scopes
    ##################################################################################

    ##################################################################################
    # Functions
    ##################################################################################

    ##################################################################################
    # Append attributes
    ##################################################################################
    public function getAssociatedFeaturesCountAttribute()
    {
        return DatasetFeature::where('dataset_id',$this->dataset_id)
            ->whereIn('gml_identifier_value', $this->dataset_feature_properties()
                ->where([
                    ['xlink_href', '<>',''],
                    ['xlink_href', '<>',$this->gml_identifier_value]
                ])->pluck('xlink_href')
            )->get()->count();
    }

    public function getDescendantFeaturesCountAttribute()
    {
        return DatasetFeature::whereHas('dataset_feature_properties', function ($query) {
            $query->where('xlink_href', '=', $this->gml_identifier_value);
        }) ->get()->count();
    }

    public function getDescendantFeaturesAttribute()
    {
        return DatasetFeature::whereHas('dataset_feature_properties', function ($query) {
            $query->where('xlink_href', '=', $this->gml_identifier_value);
        }) ->get();
    }
}
