<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('book_id'); // ID do livro relacionado
            $table->text('review_text');
            $table->tinyInteger('rating')->unsigned(); // De 1 a 5
            $table->softDeletes();
            $table->timestamps();

            $table->foreign('book_id')->references('id')->on('books');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
