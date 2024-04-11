<?php

namespace App\Http\Controllers\Aixm;

use App\Enums\ParseStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\Aixm\DatasetResource;
use App\Jobs\ParseDataset;
use App\Models\Aixm\Dataset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class DatasetController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $datasets = Dataset::byUser()->search()->paginate();
        return $this->successResponse(DatasetResource::collection($datasets));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // get user this way for public routes
        $user = Auth::guard('api')->user();

        $uploaded_file = $request->file('file');
        try {
            $validator = Validator::make($request->all(), [
                'file'=>'required',
                'name'=>'required'
            ]);
            if ($validator->fails()) {
                return $this->errorResponse(trans('validation.error'), 422, $validator->messages());
            }
            $file_name = $uploaded_file->getClientOriginalName();
            $dataset = new Dataset();
            $dataset->fill($request->all());
            $dataset->path = Dataset::getNewFileSubFolder();
            $dataset->content_type = $uploaded_file->getMimeType();
            $dataset->filename = $file_name;
            // add file number 'file(1).txt' if file exists
            $n = 1;
            while (Storage::disk('private')->exists($dataset->getPathWithFileName())) {
                $path_parts = pathinfo($dataset->getPathWithFileName());
                $dataset->filename = Str::beforeLast($file_name,'.') . '('.$n.').' . $path_parts['extension'];
                $n++;
            }
            if ($uploaded_file->storeAs($dataset->getPath(), $dataset->filename, 'private')) {
                // only admin can set user_id
                if (!$user->isAdmin()) {
                    $dataset->user_id = $user ? $user->id : 0;
                }
                $dataset->save();
                $dataset->setStatus(ParseStatus::UPLOADED);
                ParseDataset::dispatch($dataset);
                return $this->successResponse($dataset, null, 201);
            } else {
                return $this->errorResponse('Error uploading dataset', 500);
            }
        } catch (Exception $error) {
            return $this->errorResponse($error, 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Dataset $dataset)
    {
        try {
            $file_name = $dataset->getPathWithFileName();
            $type = $dataset->content_type;
            if (Storage::disk('private')->exists($file_name)) {
                // $dataset->parse();
                return response()->file(Storage::disk('private')->path($file_name), ['Content-Type' => $type]);
            } else {
                return $this->errorResponse('Not found', 404);
            }
        } catch (Exception $ex) {
            return $this->errorResponse($ex->getMessage(), 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Dataset $dataset)
    {
        // get user this way for public routes
        $user = Auth::guard('api')->user();
        // update own record or admin
        if ($user->isAdmin() || $user->id === $dataset->user_id) {
            $dataset->fill($request->all());
            $dataset->save();
            return $this->successResponse(DatasetResource::make($dataset));
        } else {
            return $this->errorResponse(trans('auth.not_enough_privileges'), 403);
        }

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Dataset $dataset)
    {
        // get user this way for public routes
        $user = Auth::guard('api')->user();

        try {
            if ($user) {
                // delete own record or admin
                if ($user->isAdmin() ||  $user->id === $dataset->user_id) {
                    $this->deleteDataset($dataset);
                    return $this->successResponse(null, null, 204);
                } else {
                    return $this->errorResponse(trans('auth.not_enough_privileges'), 403);
                }
            } else {
                // delete public record ?
                if ($dataset->user_id === 0) {
                    $this->deleteDataset($dataset);
                    return $this->successResponse(null, null, 204);
                } else {
                    return $this->errorResponse(trans('auth.not_enough_privileges'), 403);
                }
            }
        } catch (Exception $error) {
            return $this->errorResponse($error, 500);
        }
    }

    private function deleteDataset(Dataset $dataset) {
        $file_name = $dataset->getPathWithFileName();
        if (Storage::disk('private')->exists($file_name)) {
            Storage::disk('private')->delete($file_name);
        }
        $dataset->delete();
    }
}
