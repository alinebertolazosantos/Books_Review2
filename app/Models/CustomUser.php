<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CustomUser extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'custom_users'; // 🔥 aqui define o nome da tabela!

    protected $primaryKey = 'user_id'; // 🔥 se seu id principal não for 'id' padrão

    protected $fillable = [
        'name',
        'email',
        'password',
        'confirm_password',
    ];
}
