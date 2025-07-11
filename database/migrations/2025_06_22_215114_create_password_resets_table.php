<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePasswordResetsTable extends Migration
{
    public function up()
    {
        Schema::create('password_resets', function (Blueprint $table) {
            $table->string('email')->index(); // E-mail do usuário
            $table->string('token');          // Token de recuperação
            $table->timestamp('created_at')->nullable(); // Data de criação
        });
    }

    public function down()
    {
        Schema::dropIfExists('password_resets');
    }
}
