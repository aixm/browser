<?php

namespace App\Traits;

use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Validator;
use Illuminate\Pagination\LengthAwarePaginator;

trait ApiResponse{

    protected function successResponse($data, $message = null, $code = 200)
    {
        $meta = null;
        // check if resource is a collection
        if ($data instanceof AnonymousResourceCollection) {
            // check if resource is paginated
             if ($data->resource instanceof LengthAwarePaginator) {
                $meta['pagination'] = [
                    'total' => $data->total(),
                    'count' => $data->count(),
                    'per_page' => $data->perPage(),
                    'current_page' => $data->currentPage(),
                    'total_pages' => $data->lastPage()
                ];
             }
        }

        return response()->json([
            'status'=> $code,
            'message' => $message,
            'data' => $data,
            'meta' => $meta
        ], $code);
    }

    protected function errorResponse($message = null, $code = 500, $errors = null)
    {
        return response()->json([
            'status' => $code,
            'message' => $message,
            'errors' => $errors,
            'data' => null
        ], $code);
    }

}
