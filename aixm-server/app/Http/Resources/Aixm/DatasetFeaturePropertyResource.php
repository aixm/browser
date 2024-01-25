<?php

namespace App\Http\Resources\Aixm;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DatasetFeaturePropertyResource extends JsonResource
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
            'parent_id' => $this->parent_id,
            'dataset_feature_id' => $this->dataset_feature_id,
            'property_id' => $this->property_id,
            'value' => $this->value,
            'xlink_href_type' => $this->xlink_href_type,
            'xlink_href' => $this->xlink_href,
            'is_broken' => $this->is_broken,
            'dataset_feature' => DatasetFeatureResource::make($this->whenLoaded('dataset_feature')),
            'property' => PropertyResource::make($this->whenLoaded('property'))
        ];
    }
}
