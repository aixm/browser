<?php

namespace App\Http\Resources\Aixm;

use App\Http\Resources\Auth\UserResource;
use App\Models\Aixm\DatasetFeature;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DatasetResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        //return parent::toArray($request);
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'name' => $this->name,
            'filename' => $this->filename,
            'content_type' => $this->content_type,
            'path' => $this->path,
            'description' => $this->description,
            'created_at' => $this->created_at,
            'dataset_features_count' => $this->dataset_features_count,
            'user' => UserResource::make($this->whenLoaded('user')),
            'dataset_status' => DatasetStatusResource::make($this->whenLoaded('dataset_status')),
            'dataset_features' => DatasetFeatureResource::collection($this->whenLoaded('dataset_features')),
            'dataset_statuses' => DatasetStatusResource::collection($this->whenLoaded('dataset_statuses'))
        ];
    }
}
