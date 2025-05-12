<?php

namespace App\Http\Controllers;

use App\Models\CustomUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class CustomUserController extends Controller
{
    // Cadastro de usuário
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:custom_users,email',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Erro nas informações do usuário',
                'data' => $validator->errors(),
                'status' => 422,
            ], 422);
        }

        $data = CustomUser::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'confirm_password' => Hash::make($request->password),
        ]);

        return response()->json([
            'message' => 'Usuário cadastrado com sucesso',
            'data' => $data,
            'status' => 201,
        ], 201);
    }

    // Listar usuários com paginação
    public function index(Request $request)
    {
        $page = $request->get('page', 1);
        $pageSize = $request->get('pageSize', 5);
        $dir = $request->get('dir', 'asc');
        $props = $request->get('props', 'user_id');
        $search = $request->get('search', '');

        $allowedProps = ['user_id', 'name', 'email'];
        if (!in_array($props, $allowedProps)) {
            $props = 'user_id';
        }

        $query = CustomUser::select('user_id', 'name', 'email')
            ->whereNull('deleted_at')
            ->where(function ($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                  ->orWhere('email', 'like', "%$search%");
            })
            ->orderBy($props, $dir);

        $total = $query->count();
        $data = $query->offset(($page - 1) * $pageSize)
                      ->limit($pageSize)
                      ->get();
        $totalPages = ceil($total / $pageSize);

        if ($data->isEmpty()) {
            return response()->json([
                'message' => 'Nenhum usuário encontrado',
                'status' => 200,
                'total' => 0,
                'data' => [],
            ], 200);
        }

        return response()->json([
            'message' => 'Lista de usuários',
            'status' => 200,
            'page' => $page,
            'pageSize' => $pageSize,
            'dir' => $dir,
            'props' => $props,
            'search' => $search,
            'total' => $total,
            'totalPages' => $totalPages,
            'data' => $data,
        ], 200);
    }

    // Buscar usuário específico
    public function show(string $id)
    {
        $data = CustomUser::where('user_id', $id)
                    ->whereNull('deleted_at')
                    ->first();

        if (!$data) {
            return response()->json([
                'message' => 'Usuário não encontrado',
                'status' => 404,
            ], 404);
        }

        return response()->json([
            'message' => 'Usuário encontrado',
            'data' => $data,
            'status' => 200,
        ], 200);
    }

    // Atualizar usuário
    public function update(Request $request, string $id)
    {
        $data = CustomUser::where('user_id', $id)
                    ->whereNull('deleted_at')
                    ->first();

        if (!$data) {
            return response()->json([
                'message' => 'Usuário não encontrado',
                'status' => 404,
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:custom_users,email,' . $id . ',user_id',
            'password' => 'sometimes|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Erro de validação',
                'data' => $validator->errors(),
                'status' => 422,
            ], 422);
        }

        if ($request->has('name')) $data->name = $request->name;
        if ($request->has('email')) $data->email = $request->email;
        if ($request->has('password')) {
            $data->password = Hash::make($request->password);
            $data->confirm_password = Hash::make($request->password);
        }

        $data->save();

        return response()->json([
            'message' => 'Usuário atualizado com sucesso',
            'data' => $data,
            'status' => 200,
        ], 200);
    }

    // Deletar usuário (soft delete)
    public function destroy(string $id)
    {
        $data = CustomUser::where('user_id', $id)
                    ->whereNull('deleted_at')
                    ->first();

        if (!$data) {
            return response()->json([
                'message' => 'Usuário não encontrado',
                'status' => 404,
            ], 404);
        }

        $data->delete();

        return response()->json([
            'message' => 'Usuário excluído com sucesso',
            'status' => 200,
        ], 200);
    }
}
