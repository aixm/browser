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
           // 'reference_to_features_count' => $this->reference_to_features_count,
           // 'referenced_by_features_count' => $this->referenced_by_features_count,
            'dataset_feature_properties' => DatasetFeaturePropertyResource::collection($this->whenLoaded('dataset_feature_properties')),
            'dataset' => DatasetResource::make($this->whenLoaded('dataset')),
            'feature' => FeatureResource::make($this->whenLoaded('feature')),
            'reference_to_features' => DatasetFeatureReferencesResource::collection($this->reference_to_features),
            'referenced_by_features' => DatasetFeatureReferencesResource::collection($this->referenced_by_features),
        ];
    }
}

