<?php

namespace App\Http\Controllers;

use App\Models\Administrator;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends ApiController
{
    public function register(Request $request)
    {
        $validated = $this->validated($request, [
            'full_name' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'min:3', 'max:255', 'regex:/^[A-Za-z0-9._]+$/', 'unique:users,username'],
            'password' => ['required', 'string', 'min:6'],
        ]);

        if ($validated instanceof JsonResponse) {
            return $validated;
        }

        $user = User::create($validated);
        $token = $user->createToken('web')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'User registration successful',
            'data' => [
                'full_name' => $user->full_name,
                'username' => $user->username,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
                'id' => $user->id,
                'token' => $token,
                'role' => 'user',
            ],
        ], 201);
    }

    public function login(Request $request)
    {
        $validated = $this->validated($request, [
            'username' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        if ($validated instanceof JsonResponse) {
            return $validated;
        }

        $account = User::where('username', $validated['username'])->first();
        $role = 'user';

        if (! $account || ! Hash::check($validated['password'], $account->password)) {
            $account = Administrator::where('username', $validated['username'])->first();
            $role = 'admin';
        }

        if (! $account || ! Hash::check($validated['password'], $account->password)) {
            return response()->json([
                'status' => 'authentication_failed',
                'message' => 'The username or password you entered is incorrect',
            ], 400);
        }

        $token = $account->createToken('web')->plainTextToken;
        $data = [
            'id' => $account->id,
            'username' => $account->username,
            'created_at' => $account->created_at,
            'updated_at' => $account->updated_at,
            'token' => $token,
            'role' => $role,
        ];

        if ($account instanceof User) {
            $data['full_name'] = $account->full_name;
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Login successful',
            'data' => $data,
        ]);
    }

    public function logout(Request $request)
    {
        $token = $request->user()?->currentAccessToken();
        if (! $token) {
            return $this->invalidToken();
        }
        $token->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Logout successful',
        ]);
    }
}
