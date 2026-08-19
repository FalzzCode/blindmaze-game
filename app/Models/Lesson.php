<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    protected $fillable = ['set_id', 'name', 'order'];

    public function set()
    {
        return $this->belongsTo(CourseSet::class, 'set_id');
    }

    public function contents()
    {
        return $this->hasMany(LessonContent::class)->orderBy('order');
    }

    public function completedBy()
    {
        return $this->belongsToMany(User::class, 'completed_lessons');
    }
}
