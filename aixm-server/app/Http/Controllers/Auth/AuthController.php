<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Resources\Auth\UserResource;
use App\Models\Auth\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        try {
            $request->validate([
                'email' => 'email|required',
                'password' => 'required',
            ]);
            $user = User::where('email', $request->email)->first();
            if (! $user ) {
                return $this->errorResponse('', 422, [
                    'email' => trans('auth.exist')
                ]);
            }
            if ( ! Hash::check($request->password, $user->password)) {
                return $this->errorResponse('', 422, [
                    'password' => trans('auth.password')
                ]);
            }
            if (!$user->active) {
                return $this->errorResponse('', 422, [
                    'email' => trans('auth.active')
                ]);
            }
            $tokenResult = $user->createToken($request->device ? $request->device : 'asm')->plainTextToken;
            return $this->successResponse([
                'access_token' => $tokenResult,
                'token_type' => 'Bearer',
            ]);
        } catch (Exception $ex) {
            return $this->errorResponse($ex->getMessage(),500);
        }
    }

    public function logout(Request $request) {
        try{
            $request->user()->currentAccessToken()->delete();
            return $this->successResponse(null, trans('auth.logged_out'));
        } catch (Exception $ex) {
            return $this->errorResponse($ex->getMessage(),500);
        }
    }

    public function user (Request $request) {
        if (Auth::user()) {
            return $this->successResponse(UserResource::make(Auth::user()));
        } else {
            return $this->errorResponse(trans('auth.not_enough_privileges'), 403);
        }
    }
}
