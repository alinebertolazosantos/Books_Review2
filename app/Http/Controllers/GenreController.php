<?php

namespace App\Http\Controllers;

use App\Models\Genre;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class GenreController extends Controller
{
    // Listar todos os gêneros
    public function index()
    {
        $genres = Genre::whereNull('deleted_at')->get();

        if ($genres->isEmpty()) {
            return response()->json([
                'message' => 'Nenhum gênero cadastrado',
                'status' => 200,
                'data' => [],
            ], 200);
        }

        return response()->json([
            'message' => 'Lista de gêneros',
            'status' => 200,
            'data' => $genres,
        ], 200);
    }

    // Cadastrar novo gênero
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Erro nas informações do gênero',
                'data' => $validator->errors(),
                'status' => 422,
            ], 422);
        }

        $genre = Genre::create([
            'name' => $request->name,
        ]);

        return response()->json([
            'message' => 'Gênero cadastrado com sucesso',
            'data' => $genre,
            'status' => 201,
        ], 201);
    }

    // Mostrar gênero por ID
    public function show($id)
    {
        $genre = Genre::where('id', $id)->whereNull('deleted_at')->first();

        if (!$genre) {
            return response()->json([
                'message' => 'Gênero não encontrado',
                'status' => 404,
            ], 404);
        }

        return response()->json([
            'message' => 'Gênero encontrado',
            'data' => $genre,
            'status' => 200,
        ], 200);
    }

    // Atualizar gênero
    public function update(Request $request, $id)
    {
        $genre = Genre::where('id', $id)->whereNull('deleted_at')->first();

        if (!$genre) {
            return response()->json([
                'message' => 'Gênero não encontrado',
                'status' => 404,
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Erro nas informações do gênero',
                'data' => $validator->errors(),
                'status' => 422,
            ], 422);
        }

        if ($request->has('name')) {
            $genre->name = $request->name;
        }

        $genre->save();

        return response()->json([
            'message' => 'Gênero atualizado com sucesso',
            'data' => $genre,
            'status' => 200,
        ], 200);
    }

    // Deletar gênero (Soft Delete)
    public function destroy($id)
    {
        $genre = Genre::where('id', $id)->whereNull('deleted_at')->first();

        if (!$genre) {
            return response()->json([
                'message' => 'Gênero não encontrado',
                'status' => 404,
            ], 404);
        }

        $genre->delete();

        return response()->json([
            'message' => 'Gênero deletado com sucesso',
            'status' => 200,
        ], 200);
    }
}
