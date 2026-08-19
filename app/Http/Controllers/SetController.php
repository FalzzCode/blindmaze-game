<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\CourseSet;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SetController extends ApiController
{
    public function store(Request $request, string $course)
    {
        $parent = Course::where('slug', $course)->first();
        if (! $parent) {
            return $this->notFound();
        }

        $validated = $this->validated($request, ['name' => ['required', 'string', 'max:255']]);
        if ($validated instanceof JsonResponse) {
            return $validated;
        }

        $nextOrder = ((int) $parent->sets()->max('order')) + 1;
        $set = $parent->sets()->create($validated + ['order' => $nextOrder]);

        return response()->json([
            'status' => 'success',
            'message' => 'Set successfully added',
            'data' => $set,
        ], 201);
    }

    public function destroy(string $course, int $set_id)
    {
        $parent = Course::where('slug', $course)->first();
        $set = $parent ? CourseSet::where('course_id', $parent->id)->find($set_id) : null;
        if (! $parent || ! $set) {
            return $this->notFound();
        }

        $set->delete();

        return response()->json(['status' => 'success', 'message' => 'Set successfully deleted']);
    }
}
