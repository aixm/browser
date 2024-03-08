<?php

namespace App\Models\Aixm;

use App\Models\AixmGraphModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Request;

class DatasetFeature extends AixmGraphModel
{
    public $searchable = ['gml_id_value', 'gml_identifier_value'];
    // add additional attributes to the array
    // protected $appends = ['reference_to_features_count', 'reference_by_features_count', 'reference_to_features',
    // 'reference_by_features'];
    protected $appends = ['reference_to_features', 'reference_by_features'];

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

    public function getReferenceToFeaturesAttribute()
    {
        return DatasetFeature::where(function ($query) {
                $query->where('dataset_id', $this->dataset_id);
                if (Request::input('datasets')) {
                    $query->orWhereIn('dataset_id', explode(',', Request::input('datasets')));
                }
            })
            ->whereIn('gml_identifier_value', $this->dataset_feature_properties()
                ->where([
                    ['xlink_href', '<>',''],
                    ['xlink_href', '<>',$this->gml_identifier_value]
                ])->pluck('xlink_href')
            )->get();
    }

    public function getReferencedByFeaturesAttribute()
    {
        return DatasetFeature::whereHas('dataset_feature_properties', function ($query) {
            $query->where('xlink_href', '=', $this->gml_identifier_value);
            $query->where('dataset_id', $this->dataset_id);
            if (Request::input('datasets')) {
                $query->orWhereIn('dataset_id', explode(',', Request::input('datasets')));
            }
        })->get();
    }

    /*    public function getReferenceToFeaturesCountAttribute()
    {
        return DatasetFeature::where('dataset_id',$this->dataset_id)
            ->whereIn('gml_identifier_value', $this->dataset_feature_properties()
                ->where([
                    ['xlink_href', '<>',''],
                    ['xlink_href', '<>',$this->gml_identifier_value]
                ])->pluck('xlink_href')
            )->get()->count();
    }*/

    /*    public function getReferencedByFeaturesCountAttribute()
    {
        return DatasetFeature::whereHas('dataset_feature_properties', function ($query) {
            $query->where('xlink_href', '=', $this->gml_identifier_value);
        })->get()->count();
    }*/
}
