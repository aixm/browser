<?php

namespace App\Http\Controllers\Aixm;

use App\Http\Controllers\Controller;
use App\Http\Resources\Aixm\DatasetFeatureListResource;
use App\Http\Resources\Aixm\DatasetFeatureResource;
use App\Models\Aixm\DatasetFeature;
use App\Models\Aixm\Feature;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DatasetFeatureController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $features = DatasetFeature::search();
        if ($request->dataset) {
            $features = $features->where('dataset_id', $request->dataset);
        }
        $features = $features->paginate();
        return $this->successResponse(DatasetFeatureResource::collection($features));
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(DatasetFeature $datasetFeature)
    {
        return $this->successResponse(DatasetFeatureResource::make($datasetFeature));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, DatasetFeature $datasetFeature)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DatasetFeature $datasetFeature)
    {
        //
    }

    public function list(Request $request)
    {
        // get Feature searchable fields for relation sub query
        $f = new Feature();
        $fields = $f->searchable;

        $features = DatasetFeature::query()
            ->select(['feature_id', DB::raw('COUNT(feature_id) AS count')])
            ->whereHas('feature', function ($query) use ($request, $fields) {
                if ($request->search) {
                    $search = Str::of($request->search);
                    $count = count($fields);
                    for ($i = 0; $i < $count; $i++) {
                        if ($i == 0) {
                            $query->where($fields[$i], 'ilike', "%" . $search . "%");
                        } else {
                            $query->orWhere($fields[$i], 'ilike', "%" . $search . "%");
                        }
                    }
                }
            })
            ->where('dataset_id', $request->dataset)
            ->groupBy(['feature_id'])->paginate();

        return $this->successResponse(DatasetFeatureListResource::collection($features));
    }

    public function features(Request $request)
    {
        $features = DatasetFeature::search()->where([
                ['dataset_id', '=', $request->dataset],
                ['feature_id', '=', $request->feature]
            ])->paginate();
        return $this->successResponse(DatasetFeatureResource::collection($features));
    }

    public function reference_to(DatasetFeature $datasetFeature)
    {
        $features = DatasetFeature::where('dataset_id',$datasetFeature->dataset_id)
            ->whereIn('gml_identifier_value', $datasetFeature->dataset_feature_properties()
                ->where([
                    ['xlink_href', '<>',''],
                    ['xlink_href', '<>',$datasetFeature->gml_identifier_value]
                ])->pluck('xlink_href')
            )->paginate();
        return $this->successResponse(DatasetFeatureResource::collection($features));
    }

    public function referenced_by(DatasetFeature $datasetFeature)
    {
        $features = DatasetFeature::whereHas('dataset_feature_properties', function ($query) use ($datasetFeature) {
            $query->where('xlink_href', '=', $datasetFeature->gml_identifier_value);
        })->paginate();
        return $this->successResponse(DatasetFeatureResource::collection($features));
    }
}
