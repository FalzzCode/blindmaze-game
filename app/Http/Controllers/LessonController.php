<?php

namespace App\Http\Controllers;

use App\Models\CompletedLesson;
use App\Models\CourseSet;
use App\Models\Lesson;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LessonController extends ApiController
{
    public function store(Request $request)
    {
        $validated = $this->validated($request, [
            'name' => ['required', 'string', 'max:255'],
            'set_id' => ['required', 'integer', 'exists:sets,id'],
            'contents' => ['required', 'array', 'min:1'],
            'contents.*.type' => ['required', 'in:learn,quiz'],
            'contents.*.content' => ['required', 'string'],
            'contents.*.options' => ['nullable', 'array'],
            'contents.*.options.*.option_text' => ['required_with:contents.*.options', 'string'],
            'contents.*.options.*.is_correct' => ['required_with:contents.*.options', 'boolean'],
        ]);
        if ($validated instanceof JsonResponse) {
            return $validated;
        }

        $set = CourseSet::find($validated['set_id']);
        $order = ((int) $set->lessons()->max('order')) + 1;
        $lesson = $set->lessons()->create(['name' => $validated['name'], 'order' => $order]);

        foreach ($validated['contents'] as $index => $contentData) {
            $content = $lesson->contents()->create([
                'type' => $contentData['type'],
                'content' => $contentData['content'],
                'order' => $index,
            ]);
            foreach ($contentData['options'] ?? [] as $option) {
                $content->options()->create($option);
            }
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Lesson successfully added',
            'data' => $lesson->fresh(),
        ], 201);
    }

    public function destroy(int $lesson_id)
    {
        $lesson = Lesson::find($lesson_id);
        if (! $lesson) {
            return $this->notFound();
        }
        $lesson->delete();

        return response()->json(['status' => 'success', 'message' => 'Lesson successfully deleted']);
    }

    public function check(Request $request, int $lesson_id, int $content_id)
    {
        $lesson = Lesson::find($lesson_id);
        $content = $lesson?->contents()->with('options')->find($content_id);
        if (! $lesson || ! $content) {
            return $this->notFound();
        }
        if ($content->type !== 'quiz') {
            return response()->json(['status' => 'error', 'message' => 'Only for quiz content'], 400);
        }

        $validated = $this->validated($request, ['option_id' => ['required', 'integer']]);
        if ($validated instanceof JsonResponse) {
            return $validated;
        }
        $option = $content->options->firstWhere('id', $validated['option_id']);
        if (! $option) {
            return $this->notFound();
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Check answer success',
            'data' => [
                'question' => $content->content,
                'user_answer' => $option->option_text,
                'is_correct' => $option->is_correct,
            ],
        ]);
    }

    public function complete(Request $request, int $lesson_id)
    {
        $lesson = Lesson::find($lesson_id);
        if (! $lesson) {
            return $this->notFound();
        }
        $user = $request->user();
        if (! $user instanceof User) {
            return $this->forbidden();
        }

        CompletedLesson::firstOrCreate([
            'user_id' => $user->id,
            'lesson_id' => $lesson->id,
        ]);

        return response()->json(['status' => 'success', 'message' => 'Lesson successfully completed']);
    }
}
