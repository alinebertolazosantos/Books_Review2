<?php

namespace App\Http\Controllers;

use App\Models\ReadingStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReadingStatusController extends Controller
{
    // Listar todos os status de leitura
    public function index(Request $request)
    {
        $page = $request->get('page', 1);
        $pageSize = $request->get('pageSize', 5);
        $dir = $request->get('dir', 'asc');
        $props = $request->get('props', 'id');
        $search = $request->get('search', '');

        $allowedProps = ['id', 'name'];
        if (!in_array($props, $allowedProps)) {
            $props = 'id';
        }

        $query = ReadingStatus::select('id', 'name')
                    ->whereNull('deleted_at')
                    ->where(function ($q) use ($search) {
                        $q->where('name', 'like', "%$search%");
                    })
                    ->orderBy($props, $dir);

        $total = $query->count();

        if ($total === 0) {
            return response()->json([
                'message' => 'Nenhum status de leitura encontrado.',
                'status' => 404
            ], 404);
        }

        $data = $query->offset(($page - 1) * $pageSize)
                      ->limit($pageSize)
                      ->get();

        $totalPages = ceil($total / $pageSize);

        return response()->json([
            'message' => 'Lista de status de leitura',
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

    // Cadastrar novo status de leitura
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Erro nas informações do status.',
                'data' => $validator->errors(),
                'status' => 422,
            ], 422);
        }

        $status = ReadingStatus::create([
            'name' => $request->name,
        ]);

        return response()->json([
            'message' => 'Status de leitura cadastrado com sucesso.',
            'data' => $status,
            'status' => 201,
        ], 201);
    }

    // Mostrar status por ID
    public function show($id)
    {
        $status = ReadingStatus::where('id', $id)->whereNull('deleted_at')->first();

        if (!$status) {
            return response()->json([
                'message' => 'Status de leitura não encontrado.',
                'status' => 404,
            ], 404);
        }

        return response()->json([
            'message' => 'Status de leitura encontrado.',
            'data' => $status,
            'status' => 200,
        ], 200);
    }

    // Atualizar status
    public function update(Request $request, $id)
    {
        $status = ReadingStatus::where('id', $id)->whereNull('deleted_at')->first();

        if (!$status) {
            return response()->json([
                'message' => 'Status de leitura não encontrado.',
                'status' => 404,
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Erro de validação',
                'data' => $validator->errors(),
                'status' => 422,
            ], 422);
        }

        if ($request->has('name')) {
            $status->name = $request->name;
        }

        $status->save();

        return response()->json([
            'message' => 'Status de leitura atualizado com sucesso.',
            'data' => $status,
            'status' => 200,
        ], 200);
    }

    // Deletar status (soft delete)
    public function destroy($id)
    {
        $status = ReadingStatus::where('id', $id)->whereNull('deleted_at')->first();

        if (!$status) {
            return response()->json([
                'message' => 'Status de leitura não encontrado.',
                'status' => 404,
            ], 404);
        }

        $status->delete();

        return response()->json([
            'message' => 'Status de leitura deletado com sucesso.',
            'status' => 200,
        ], 200);
    }
}
