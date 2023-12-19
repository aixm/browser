<?php

namespace App\Http\Resources\Aixm;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PropertyResource extends JsonResource
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
            'ref_feature_id' => $this->ref_feature_id,
            'is_xlink' => $this->is_xlink,
            'is_identifying' => $this->is_identifying,
            'name' => $this->name,
            'description' => $this->description,
            'ref_feature' => FeatureResource::make($this->whenLoaded('ref_feature')),
        ];
    }
}
