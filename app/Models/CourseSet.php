<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CourseSet extends Model
{
    protected $table = 'sets';

    protected $fillable = ['course_id', 'name', 'order'];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function lessons()
    {
        return $this->hasMany(Lesson::class, 'set_id')->orderBy('order');
    }
}
