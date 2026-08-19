<?php

namespace Database\Seeders;

use App\Models\Administrator;
use App\Models\Course;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $student = User::updateOrCreate(
            ['username' => 'student'],
            ['full_name' => 'Test Student', 'password' => Hash::make('password')],
        );

        Administrator::updateOrCreate(
            ['username' => 'admin'],
            ['password' => Hash::make('password')],
        );

        $course = Course::firstOrCreate(
            ['slug' => 'web-dev-fundamentals'],
            [
                'name' => 'Web Dev Fundamentals',
                'description' => 'Pelajari dasar HTML, CSS, dan JavaScript melalui lesson dan quiz berurutan.',
                'is_published' => true,
            ],
        );

        if ($course->sets()->count() === 0) {
            $htmlSet = $course->sets()->create(['name' => 'HTML Basics', 'order' => 0]);
            $htmlLesson = $htmlSet->lessons()->create(['name' => 'Introduction to HTML', 'order' => 0]);
            $htmlLesson->contents()->create([
                'type' => 'learn',
                'content' => 'HTML adalah bahasa markup untuk menyusun struktur halaman web.',
                'order' => 0,
            ]);
            $quiz = $htmlLesson->contents()->create([
                'type' => 'quiz',
                'content' => 'Apa kepanjangan dari HTML?',
                'order' => 1,
            ]);
            $quiz->options()->createMany([
                ['option_text' => 'Hyper Text Markup Language', 'is_correct' => true],
                ['option_text' => 'Home Tool Markup Language', 'is_correct' => false],
                ['option_text' => 'Hyperlink Text Management Language', 'is_correct' => false],
                ['option_text' => 'High Transfer Markup Language', 'is_correct' => false],
            ]);

            $cssSet = $course->sets()->create(['name' => 'CSS Basics', 'order' => 1]);
            $cssLesson = $cssSet->lessons()->create(['name' => 'Styling a Page', 'order' => 0]);
            $cssLesson->contents()->create([
                'type' => 'learn',
                'content' => 'CSS mengatur tampilan, layout, warna, dan responsivitas halaman web.',
                'order' => 0,
            ]);
        }

        $student->forceFill(['full_name' => 'Test Student'])->save();
    }
}
