<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\CustomUser;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use App\Mail\EmailVerificationMail;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:100',
            'email' => 'required|string|email|max:100|unique:custom_users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Erro de validação',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = CustomUser::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // 🔐 Gera o link de verificação
        $verificationLink = url("/verify-email/{$user->id}/" . sha1($user->email));

        // ✉️ Envia o e-mail
        Mail::to($user->email)->send(new EmailVerificationMail($user->name, $verificationLink));

        return response()->json([
            'message' => 'Usuário registrado com sucesso. Verifique seu e-mail.',
            'token' => $user->createToken('token')->plainTextToken,
            'user' => $user,
        ], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'Credenciais inválidas.'
            ], 401);
        }

        $user = CustomUser::where('email', $request->email)->first();

        return response()->json([
            'token' => $user->createToken('token')->plainTextToken,
            'user' => $user,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout realizado com sucesso.'
        ]);
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:6|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'Senha atual incorreta.',
            ], 422);
        }

        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json([
            'message' => 'Senha alterada com sucesso.',
        ], 200);
    }

    public function forgotPassword(Request $request)
{
    $request->validate([
        'email' => 'required|email',
    ]);

    $user = CustomUser::where('email', $request->email)->first();

    if (!$user) {
        return response()->json([
            'message' => 'Usuário não encontrado com este e-mail.'
        ], 404);
    }

    // 🔑 Geração de token e link
    $token = Str::random(60);
    $link = url("/reset-password/{$user->id}/{$token}");

    // 💾 Salva token na tabela (crie a migration se necessário)
    DB::table('password_resets')->updateOrInsert(
        ['email' => $user->email],
        ['token' => $token, 'created_at' => now()]
    );

    // ✉️ Reutiliza o mesmo e-mail para envio
    Mail::to($user->email)->send(new EmailVerificationMail($user->name, $link));

    return response()->json([
        'message' => 'E-mail de recuperação enviado com sucesso.',
        'link_simulado' => $link // opcional, útil para testes locais
    ]);
}
public function resetPassword(Request $request, $id, $token)
{
    $request->validate([
        'password' => 'required|confirmed|min:6',
    ]);

    $user = CustomUser::find($id);
    $reset = DB::table('password_resets')->where('email', $user->email)->first();

    if (!$reset || $reset->token !== $token) {
        return response()->json(['message' => 'Token inválido ou expirado.'], 400);
    }

    $user->password = Hash::make($request->password);
    $user->save();

    DB::table('password_resets')->where('email', $user->email)->delete();

    return response()->json(['message' => 'Senha alterada com sucesso.']);
}

public function changePassword(Request $request)
{
    $request->validate([
        'current_password' => 'required',
        'new_password' => 'required|confirmed|min:6',
    ]);

    $user = auth()->user();

    if (!Hash::check($request->current_password, $user->password)) {
        return response()->json(['message' => 'Senha atual incorreta'], 400);
    }

    $user->password = Hash::make($request->new_password);
    $user->save();

    return response()->json(['message' => 'Senha alterada com sucesso.']);
}

public function resetPassword(Request $request, $id, $token)
{
    $request->validate([
        'password' => 'required|string|min:6|confirmed',
    ]);

    $user = CustomUser::find($id);

    if (!$user) {
        return response()->json(['message' => 'Usuário não encontrado.'], 404);
    }

    $reset = DB::table('password_resets')->where('email', $user->email)->first();

    if (!$reset || $reset->token !== $token) {
        return response()->json(['message' => 'Token inválido ou expirado.'], 400);
    }

    // Atualiza a senha
    $user->password = Hash::make($request->password);
    $user->save();

    // Remove o token da tabela
    DB::table('password_resets')->where('email', $user->email)->delete();

    return response()->json(['message' => 'Senha redefinida com sucesso.']);
}

}
