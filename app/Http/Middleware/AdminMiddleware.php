<?php

namespace App\Http\Middleware;

use App\Models\Administrator;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $account = $request->user();

        if (! $account) {
            return response()->json([
                'status' => 'invalid_token',
                'message' => 'Invalid or expired token',
            ], 401);
        }

        if (! $account instanceof Administrator) {
            return response()->json([
                'status' => 'insufficient_permissions',
                'message' => 'Access forbidden',
            ], 403);
        }

        return $next($request);
    }
}
