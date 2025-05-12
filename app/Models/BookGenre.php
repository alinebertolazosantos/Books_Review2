<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BookGenre extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'book_genre';

    protected $fillable = [
        'book_id',
        'genre_id',
    ];
}
