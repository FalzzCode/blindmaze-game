<?php

namespace App\Http\Controllers;

use App\Models\Lesson;
use App\Models\User;
use Illuminate\Http\Request;

class UserProgressController extends ApiController
{
    public function index(Request $request)
    {
        $user = $request->user();
        if (! $user instanceof User) {
            return $this->forbidden();
        }

        $progress = $user->enrollments()->with('course')->get()->map(function ($enrollment) use ($user) {
            $course = $enrollment->course;
            $lessonIds = Lesson::whereHas('set', fn ($query) => $query->where('course_id', $course->id))->pluck('id');
            $completedLessons = $user->completedLessons()->whereIn('lessons.id', $lessonIds)->get([
                'lessons.id', 'lessons.name', 'lessons.order',
            ]);

            return [
                'course' => $course,
                'completed_lessons' => $completedLessons,
            ];
        })->values()->all();

        return response()->json([
            'status' => 'success',
            'message' => 'User progress retrieved successfully',
            'data' => ['progress' => $progress],
        ], 201);
    }
}
