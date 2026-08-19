<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('administrators', function (Blueprint $table) {
            $table->id();
            $table->string('username')->unique();
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->boolean('is_published')->default(false);
            $table->timestamps();
        });

        Schema::create('sets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->unsignedTinyInteger('order')->default(0);
            $table->timestamps();
            $table->unique(['course_id', 'order']);
        });

        Schema::create('lessons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('set_id')->constrained('sets')->cascadeOnDelete();
            $table->text('name');
            $table->unsignedTinyInteger('order')->default(0);
            $table->timestamps();
            $table->unique(['set_id', 'order']);
        });

        Schema::create('lesson_contents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lesson_id')->constrained()->cascadeOnDelete();
            $table->enum('type', ['learn', 'quiz']);
            $table->text('content');
            $table->unsignedTinyInteger('order')->default(0);
            $table->timestamps();
            $table->unique(['lesson_id', 'order']);
        });

        Schema::create('options', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lesson_content_id')->constrained('lesson_contents')->cascadeOnDelete();
            $table->text('option_text');
            $table->boolean('is_correct')->default(false);
            $table->timestamps();
        });

        Schema::create('enrollments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['user_id', 'course_id']);
        });

        Schema::create('completed_lessons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('lesson_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['user_id', 'lesson_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('completed_lessons');
        Schema::dropIfExists('enrollments');
        Schema::dropIfExists('options');
        Schema::dropIfExists('lesson_contents');
        Schema::dropIfExists('lessons');
        Schema::dropIfExists('sets');
        Schema::dropIfExists('courses');
        Schema::dropIfExists('administrators');
    }
};
