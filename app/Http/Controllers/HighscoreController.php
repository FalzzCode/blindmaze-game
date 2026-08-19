<?php

namespace App\Http\Controllers;

use App\Models\GameScore;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HighscoreController extends ApiController
{
    public function index(): JsonResponse
    {
        $scores = GameScore::query()
            ->orderByDesc('score')
            ->orderByDesc('stage')
            ->orderBy('created_at')
            ->limit(10)
            ->get(['id', 'username', 'stage', 'score', 'created_at']);

        return response()->json([
            'status' => 'success',
            'message' => 'Highscores retrieved successfully',
            'data' => ['scores' => $scores],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $this->validated($request, [
            'username' => ['required', 'string', 'min:2', 'max:40'],
            'stage' => ['required', 'integer', 'min:1', 'max:999'],
            'score' => ['required', 'integer', 'min:0', 'max:9999999'],
        ]);

        if ($validated instanceof JsonResponse) {
            return $validated;
        }

        $score = GameScore::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Score saved successfully',
            'data' => ['score' => $score],
        ], 201);
    }
}
