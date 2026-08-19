<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GameScore extends Model
{
    protected $fillable = [
        'username',
        'stage',
        'score',
    ];

    protected function casts(): array
    {
        return [
            'stage' => 'integer',
            'score' => 'integer',
        ];
    }
}
