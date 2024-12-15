<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ConfigMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $property): Response
    {
        if (!isset($property) || empty($property)) {
            abort(401, 'Unauthorised');
        }

        $config = \App\Flow\Config::getConfigValue($property);
        if ($config) {
            return $next($request);
        }
        abort(401, 'Unauthorised');
    }
}
