<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\CustomUser;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!Auth::guard('web')->attempt($credentials)) {
            return response()->json(['message' => 'Credenciais inválidas.'], 401);
        }

        $user = CustomUser::where('email', $request->email)->first();

        return response()->json([
            'token' => $user->createToken('token')->plainTextToken,
            'user' => $user,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Logout realizado com sucesso.']);
    }
}
