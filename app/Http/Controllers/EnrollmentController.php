<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\User;
use Illuminate\Http\Request;

class EnrollmentController extends ApiController
{
    public function store(Request $request, string $course_slug)
    {
        $user = $request->user();
        if (! $user instanceof User) {
            return $this->forbidden();
        }

        $course = Course::where('slug', $course_slug)->where('is_published', true)->first();
        if (! $course) {
            return $this->notFound();
        }

        if (Enrollment::where('user_id', $user->id)->where('course_id', $course->id)->exists()) {
            return response()->json(['status' => 'error', 'message' => 'The user is already registered for this course'], 400);
        }

        $enrollment = Enrollment::create(['user_id' => $user->id, 'course_id' => $course->id]);

        return response()->json(['status' => 'success', 'message' => 'User registered successful', 'data' => $enrollment], 201);
    }
}
