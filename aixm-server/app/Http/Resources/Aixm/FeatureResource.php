<?php

namespace App\Http\Resources\Aixm;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FeatureResource extends JsonResource
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
            'name' => $this->name,
            'type' => $this->type,
            'abbreviation' => $this->abbreviation,
            'color' => $this->color,
            'icon' => $this->icon,
            'order' => $this->order,
            'prefix' => $this->prefix,
            'namespace' => $this->namespace,
            'description' => $this->description,
            'properties' => PropertyResource::collection($this->whenLoaded('properties')),
        ];
    }
}
