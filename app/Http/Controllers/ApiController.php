<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

abstract class ApiController extends Controller
{
    protected function validated(Request $request, array $rules): array|JsonResponse
    {
        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid field(s) in request',
                'errors' => $validator->errors(),
            ], 400);
        }

        return $validator->validated();
    }

    protected function invalidToken(): JsonResponse
    {
        return response()->json([
            'status' => 'invalid_token',
            'message' => 'Invalid or expired token',
        ], 401);
    }

    protected function forbidden(): JsonResponse
    {
        return response()->json([
            'status' => 'insufficient_permissions',
            'message' => 'Access forbidden',
        ], 403);
    }

    protected function notFound(): JsonResponse
    {
        return response()->json([
            'status' => 'not_found',
            'message' => 'Resource not found',
        ], 404);
    }
}
