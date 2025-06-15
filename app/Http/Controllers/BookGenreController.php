<?php

namespace App\Http\Controllers;

use App\Models\BookGenre;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BookGenreController extends Controller
{
    // 🔎 Listar todas as relações
    public function index()
    {
        $relations = BookGenre::whereNull('deleted_at')->get();

        return response()->json([
            'message' => $relations->isEmpty()
                ? 'Nenhuma relação livro-gênero cadastrada.'
                : 'Lista de relações recuperada com sucesso.',
            'data' => $relations,
            'status' => 200,
        ], 200);
    }

    // ➕ Criar uma nova relação
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'book_id' => 'required|exists:books,id',
            'genre_id' => 'required|exists:genres,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Erro de validação',
                'errors' => $validator->errors(),
                'status' => 422,
            ], 422);
        }

        $relation = BookGenre::create($request->only(['book_id', 'genre_id']));

        return response()->json([
            'message' => 'Relação criada com sucesso.',
            'data' => $relation,
            'status' => 201,
        ], 201);
    }

    // 🧾 Exibir uma relação específica
    public function show($id)
    {
        $relation = BookGenre::where('id', $id)->whereNull('deleted_at')->first();

        if (!$relation) {
            return response()->json([
                'message' => 'Relação não encontrada.',
                'status' => 404,
            ], 404);
        }

        return response()->json([
            'message' => 'Relação encontrada com sucesso.',
            'data' => $relation,
            'status' => 200,
        ], 200);
    }

    // ✏️ Atualizar uma relação existente
    public function update(Request $request, $id)
    {
        $relation = BookGenre::where('id', $id)->whereNull('deleted_at')->first();

        if (!$relation) {
            return response()->json([
                'message' => 'Relação não encontrada.',
                'status' => 404,
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'book_id' => 'sometimes|exists:books,id',
            'genre_id' => 'sometimes|exists:genres,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Erro de validação.',
                'errors' => $validator->errors(),
                'status' => 422,
            ], 422);
        }

        if ($request->has('book_id')) {
            $relation->book_id = $request->book_id;
        }

        if ($request->has('genre_id')) {
            $relation->genre_id = $request->genre_id;
        }

        $relation->save();

        return response()->json([
            'message' => 'Relação atualizada com sucesso.',
            'data' => $relation,
            'status' => 200,
        ], 200);
    }

    // ❌ Deletar uma relação
    public function destroy($id)
    {
        $relation = BookGenre::where('id', $id)->whereNull('deleted_at')->first();

        if (!$relation) {
            return response()->json([
                'message' => 'Relação não encontrada.',
                'status' => 404,
            ], 404);
        }

        $relation->delete();

        return response()->json([
            'message' => 'Relação excluída com sucesso.',
            'status' => 200,
        ], 200);
    }
}
