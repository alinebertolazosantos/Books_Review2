<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('author')->nullable();
            $table->unsignedBigInteger('publisher_id')->nullable();
            $table->integer('publication_year')->nullable();
            $table->text('synopsis')->nullable();
            $table->string('cover_image')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Chave estrangeira (se já tiver tabela publishers criada)
            $table->foreign('publisher_id')->references('id')->on('publishers')->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::dropIfExists('books');
    }
};
