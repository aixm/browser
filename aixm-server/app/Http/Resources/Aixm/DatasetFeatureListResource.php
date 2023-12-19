<?php

namespace App\Http\Resources\Aixm;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DatasetFeatureListResource extends JsonResource
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
            'feature_id' => $this->feature_id,
            'count' => $this->count,
            'feature' => FeatureResource::make($this->whenLoaded('feature'))
        ];
    }
}
