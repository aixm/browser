<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class JsonSnake
{
    /**
     * Handle an incoming request.
     *
     * @param Request $request
     * @param Closure $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if ($request->isJson()) {
            $this->undercore($request);
        }
        return $next($request);
    }


    private function undercore(Request $request)
    {
        $array = $request->json()->all();

        $this->transformKeys($array);
        //now we replace our json data with our new json data without the last element
        $request->json()->replace($array);
    }

    private function transformKeys(&$array)
    {
        foreach (array_keys($array) as $key):
            # Working with references here to avoid copying the value,
            # since you said your data is quite large.
            $value = &$array[$key];
            unset($array[$key]);
            # This is what you actually want to do with your keys:
            #  - remove exclamation marks at the front
            #  - camelCase to snake_case
            $transformedKey = Str::snake($key);
            # Work recursively
            if (is_array($value)) $this->transformKeys($value);
            # Store with new key
            $array[$transformedKey] = $value;
            # Do not forget to unset references!
            unset($value);
        endforeach;
    }
}
