<?php

namespace App\Http\Controllers;

use App\Models\Administrator;
use App\Models\Course;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CourseController extends ApiController
{
    public function index()
    {
        $courses = Course::where('is_published', true)->orderBy('id')->get([
            'id', 'name', 'slug', 'description', 'is_published', 'created_at', 'updated_at',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Courses retrieved successfully',
            'data' => ['courses' => $courses],
        ]);
    }

    public function show(Request $request, string $course_slug)
    {
        $course = Course::where('slug', $course_slug)->with([
            'sets.lessons.contents.options',
        ])->first();

        if (! $course || (! $course->is_published && ! ($request->user() instanceof Administrator))) {
            return $this->notFound();
        }

        $account = $request->user();
        $isRegistered = $account instanceof User && $course->users()->whereKey($account->id)->exists();
        $completedIds = $account instanceof User
            ? $account->completedLessons()->pluck('lessons.id')->flip()
            : collect();
        $foundCurrent = false;

        $sets = $course->sets->map(function ($set) use ($course, $isRegistered, $completedIds, &$foundCurrent) {
            $lessons = $set->lessons->map(function ($lesson) use ($isRegistered, $completedIds, &$foundCurrent) {
                $isCompleted = $completedIds->has($lesson->id);
                $status = 'locked';
                if ($isRegistered && $isCompleted) {
                    $status = 'completed';
                } elseif ($isRegistered && ! $foundCurrent) {
                    $status = 'current';
                    $foundCurrent = true;
                }

                $contents = $isRegistered ? $lesson->contents->map(function ($content) {
                    return [
                        'id' => $content->id,
                        'type' => $content->type,
                        'content' => $content->content,
                        'order' => $content->order,
                        'options' => $content->type === 'quiz' ? $content->options->map(fn ($option) => [
                            'id' => $option->id,
                            'option_text' => $option->option_text,
                        ])->values()->all() : [],
                    ];
                })->values()->all() : [];

                return [
                    'id' => $lesson->id,
                    'name' => $lesson->name,
                    'order' => $lesson->order,
                    'status' => $status,
                    'completed' => $isCompleted,
                    'contents' => $contents,
                ];
            })->values()->all();

            return [
                'id' => $set->id,
                'name' => $set->name,
                'order' => $set->order,
                'course_slug' => $course->slug,
                'lessons' => $lessons,
            ];
        })->values()->all();

        return response()->json([
            'status' => 'success',
            'message' => 'Course details retrieved successfully',
            'data' => [
                'id' => $course->id,
                'name' => $course->name,
                'slug' => $course->slug,
                'description' => $course->description,
                'is_published' => $course->is_published,
                'is_registered' => $isRegistered,
                'created_at' => $course->created_at,
                'updated_at' => $course->updated_at,
                'sets' => $sets,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validated($request, [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'slug' => ['required', 'string', 'max:255', 'unique:courses,slug'],
        ]);
        if ($validated instanceof JsonResponse) {
            return $validated;
        }

        $course = Course::create($validated + ['is_published' => false]);

        return response()->json(['status' => 'success', 'message' => 'Course successfully added', 'data' => $course], 201);
    }

    public function update(Request $request, string $course_slug)
    {
        $course = Course::where('slug', $course_slug)->first();
        if (! $course) {
            return $this->notFound();
        }
        $validated = $this->validated($request, [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'is_published' => ['nullable', 'boolean'],
        ]);
        if ($validated instanceof JsonResponse) {
            return $validated;
        }

        $course->update($validated);

        return response()->json(['status' => 'success', 'message' => 'Course successfully updated', 'data' => $course->fresh()], 200);
    }

    public function destroy(string $course_slug)
    {
        $course = Course::where('slug', $course_slug)->first();
        if (! $course) {
            return $this->notFound();
        }
        $course->delete();

        return response()->json(['status' => 'success', 'message' => 'Course successfully deleted']);
    }
}
