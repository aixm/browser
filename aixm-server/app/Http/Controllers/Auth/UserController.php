<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Resources\Auth\UserResource;
use App\Models\Auth\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        if (Auth::user()->isAdmin()) {
            $users = User::search()->paginate();
            return $this->successResponse(UserResource::collection($users));
        } else {
            return $this->errorResponse(trans('auth.not_enough_privileges'), 403);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        if (Auth::user()->isAdmin()) {
            $request->validate([
                'email' => 'required|email|unique:users',
                'password' => 'required|min:6',
            ]);
            $user = new User();
            $user->fill($request->all());
            $user->password = bcrypt($request->password);
            $user->save();
            return $this->successResponse(UserResource::make($user), null, 201);
        } else {
            return $this->errorResponse(trans('auth.not_enough_privileges'), 403);
        }

    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Auth\User  $user
     * @return \Illuminate\Http\Response
     */
    public function show(User $user)
    {
        if (Auth::user()->isAdmin()) {
            return $this->successResponse(UserResource::make($user), null, 201);
        } else {
            return $this->errorResponse(trans('auth.not_enough_privileges'), 403);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Auth\User  $user
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, User $user)
    {
        if (Auth::user()->isAdmin() || Auth::user()->id == $user->id) {
            $request->validate([
                'email' => 'email|unique:users,email,' . $user->id,
            ]);
            if ($request->change_password===true) {
                $request->validate([
                    'password' => 'required|min:6',
                ]);
            }
            $user->fill($request->all());
            if (($user->password) && ($request->change_password===true)) {
                $user->password = bcrypt($request->password);
            }
            $user->save();
            return $this->successResponse(UserResource::make($user), null, 201);
        } else {
            return $this->errorResponse(trans('auth.not_enough_privileges'), 403);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Auth\User  $user
     * @return \Illuminate\Http\Response
     */
    public function destroy(User $user)
    {
        if (Auth::user()->isAdmin()) {
            $user->delete();
            return $this->successResponse(null, null, 204);
        } else {
            return $this->errorResponse(trans('auth.not_enough_privileges'), 403);
        }
    }
}
