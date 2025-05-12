<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('custom_users', function (Blueprint $table) {
            $table->id('user_id');
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('confirm_password');
            $table->timestamps();
            $table->softDeletes(); // <- necessário para o whereNull('deleted_at')
        });
    }
    

    public function down()
    {
        Schema::dropIfExists('custom_users');
    }
};
