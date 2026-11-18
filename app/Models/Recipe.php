<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['title', 'description', 'servings', 'cook_minutes', 'ingredients', 'steps'])]
class Recipe extends Model
{
    protected function casts(): array
    {
        return [
            'ingredients' => 'array',
            'steps' => 'array',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
