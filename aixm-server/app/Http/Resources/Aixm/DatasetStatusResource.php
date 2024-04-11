<?php

namespace App\Http\Resources\Aixm;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DatasetStatusResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'dataset_id' => $this->dataset_id,
            'status' => $this->status,
            'message' => $this->message,
            'created_at' => $this->created_at,
        ];
    }
}
