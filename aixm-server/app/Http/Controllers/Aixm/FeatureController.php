<?php

namespace App\Http\Controllers\Aixm;

use App\Http\Controllers\Controller;
use App\Http\Resources\Aixm\FeatureResource;
use App\Models\Aixm\Feature;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FeatureController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $features = Feature::search();
        if ($request->page) {
            $features = $features->paginate();
        } else {
            $features = $features->get();
        }
        return $this->successResponse(FeatureResource::collection($features));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if (Auth::guard('api')->user()->isAdmin()) {
            $feature = new Feature();
            $feature->fill($request->all());
            $feature->save();
            return $this->successResponse(FeatureResource::make($feature), null, 201);
        } else {
            return $this->errorResponse(trans('auth.not_enough_privileges'), 403);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Feature $feature)
    {
        return $this->successResponse(FeatureResource::make($feature));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Feature $feature)
    {
        if (Auth::guard('api')->user()->isAdmin()) {
            $feature->fill($request->all());
            $feature->save();
            return $this->successResponse(FeatureResource::make($feature));
        } else {
            return $this->errorResponse(trans('auth.not_enough_privileges'), 403);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Feature $feature)
    {
        if (Auth::guard('api')->user()->isAdmin()) {
            $feature->delete();
            return $this->successResponse(null, null, 204);
        } else {
            return $this->errorResponse(trans('auth.not_enough_privileges'), 403);
        }
    }
}
