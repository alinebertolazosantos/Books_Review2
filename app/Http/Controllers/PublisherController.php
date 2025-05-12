<?php

namespace App\Http\Controllers;

use App\Models\Publisher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PublisherController extends Controller
{
    // Listar todos os publishers
    public function index()
    {
        $publishers = Publisher::whereNull('deleted_at')->get();

        if ($publishers->isEmpty()) {
            return response()->json([
                'message' => 'Nenhuma editora cadastrada',
                'status' => 200,
                'data' => [],
            ], 200);
        }

        return response()->json([
            'message' => 'Lista de editoras',
            'status' => 200,
            'data' => $publishers,
        ], 200);
    }

    // Cadastrar novo publisher
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Erro nas informações da editora',
                'data' => $validator->errors(),
                'status' => 422,
            ], 422);
        }

        $publisher = Publisher::create([
            'name' => $request->name,
        ]);

        return response()->json([
            'message' => 'Editora cadastrada com sucesso',
            'data' => $publisher,
            'status' => 201,
        ], 201);
    }

    // Mostrar publisher por ID
    public function show($id)
    {
        $publisher = Publisher::where('id', $id)->whereNull('deleted_at')->first();

        if (!$publisher) {
            return response()->json([
                'message' => 'Editora não encontrada',
                'status' => 404,
            ], 404);
        }

        return response()->json([
            'message' => 'Editora encontrada',
            'data' => $publisher,
            'status' => 200,
        ], 200);
    }

    // Atualizar publisher
    public function update(Request $request, $id)
    {
        $publisher = Publisher::where('id', $id)->whereNull('deleted_at')->first();

        if (!$publisher) {
            return response()->json([
                'message' => 'Editora não encontrada',
                'status' => 404,
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Erro nas informações da editora',
                'data' => $validator->errors(),
                'status' => 422,
            ], 422);
        }

        if ($request->has('name')) {
            $publisher->name = $request->name;
        }

        $publisher->save();

        return response()->json([
            'message' => 'Editora atualizada com sucesso',
            'data' => $publisher,
            'status' => 200,
        ], 200);
    }

    // Deletar publisher (Soft Delete)
    public function destroy($id)
    {
        $publisher = Publisher::where('id', $id)->whereNull('deleted_at')->first();

        if (!$publisher) {
            return response()->json([
                'message' => 'Editora não encontrada',
                'status' => 404,
            ], 404);
        }

        $publisher->delete();

        return response()->json([
            'message' => 'Editora deletada com sucesso',
            'status' => 200,
        ], 200);
    }
}
