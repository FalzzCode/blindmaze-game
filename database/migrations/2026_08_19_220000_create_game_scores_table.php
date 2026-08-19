<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('game_scores', function (Blueprint $table) {
            $table->id();
            $table->string('username', 40);
            $table->unsignedInteger('stage')->default(1);
            $table->unsignedInteger('score')->default(0);
            $table->timestamps();
            $table->index(['score', 'stage']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('game_scores');
    }
};
