<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'slug', 'description', 'is_published'];

    protected function casts(): array
    {
        return ['is_published' => 'boolean'];
    }

    public function sets()
    {
        return $this->hasMany(CourseSet::class)->orderBy('order');
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'enrollments');
    }
}
