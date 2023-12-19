<?php

namespace App\Http\Resources\Aixm;

use App\Models\Aixm\DatasetFeature;
use App\Models\Aixm\DatasetFeatureProperty;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DatasetFeatureResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // return parent::toArray($request);

        return [
            'id' => $this->id,
            'dataset_id' => $this->dataset_id,
            'feature_id' => $this->feature_id,
            'gml_id_value' => $this->gml_id_value,
            'gml_identifier_value' => $this->gml_identifier_value,
            'associated_features_count' => $this->associated_features_count,
            'descendant_features_count' => $this->descendant_features_count,
            'dataset_feature_properties' => DatasetFeaturePropertyResource::collection($this->whenLoaded('dataset_feature_properties')),
            'dataset' => DatasetResource::make($this->whenLoaded('dataset')),
            'feature' => FeatureResource::make($this->whenLoaded('feature')),
            //'associated_features' => DatasetFeatureResource::collection($this->associated_features),
            'descendant_features' => DatasetFeatureResource::collection($this->descendant_features),
        ];
    }
}

