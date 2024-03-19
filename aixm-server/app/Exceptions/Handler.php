<?php

namespace App\Exceptions;

use App\Traits\ApiResponse;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    use ApiResponse;
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Throwable  $exception
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @throws \Throwable
     */
    public function render($request, Throwable $exception)
    {
        if ($request->expectsJson()) {
            if ($exception instanceof AuthenticationException) {
                // return response()->json(["status_code" => 401, 'message' => 'Unauthenticated'], 401);
                return $this->errorResponse('Unauthenticated', 401);
            } else {
                if ($exception instanceof HttpException) {
                    return $this->errorResponse($exception->getMessage(), $exception->getStatusCode());
                } else {
                    // crfs token mismatch => 401
                    if ($exception->getMessage() === 'CSRF token mismatch.') {
                        return $this->errorResponse($exception->getMessage(), 419);
                    }
                    if ($exception instanceof ModelNotFoundException) {
                        return $this->errorResponse('Resource Not Found', 404);
                    }
                    if($exception instanceof ValidationException) {
                        return $this->errorResponse('Validation Error.', 422, $exception->validator->getMessageBag()->toArray());
                    }
                    return $this->errorResponse($exception->getMessage(), 500);
                }
            }
        }

        return parent::render($request, $exception);
    }

}
