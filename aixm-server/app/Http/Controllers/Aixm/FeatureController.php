<?php

namespace App\Http\Controllers\Aixm;

use App\Http\Controllers\Controller;
use App\Http\Resources\Aixm\FeatureResource;
use App\Models\Aixm\Feature;
use Illuminate\Http\Request;

class FeatureController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $features = Feature::search()->paginate();
        return $this->successResponse(FeatureResource::collection($features));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->TODO();
    }

    /**
     * Display the specified resource.
     */
    public function show(Feature $feature)
    {
        $this->TODO();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Feature $feature)
    {
        $this->TODO();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Feature $feature)
    {
        $this->TODO();
    }
}
