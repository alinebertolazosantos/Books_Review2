<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BookController extends Controller
{
    // Listar livros
    public function index()
    {
        $books = Book::whereNull('deleted_at')->get();

        if ($books->isEmpty()) {
            return response()->json([
                'message' => 'Nenhum livro cadastrado',
                'status' => 200,
                'data' => [],
            ], 200);
        }

        return response()->json([
            'message' => 'Lista de livros',
            'status' => 200,
            'data' => $books,
        ], 200);
    }

    // Cadastrar livro
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'author' => 'nullable|string|max:255',
            'publisher_id' => 'nullable|exists:publishers,id',
            'publication_year' => 'nullable|integer',
            'synopsis' => 'nullable|string',
            'cover_image' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Erro nas informações do livro',
                'data' => $validator->errors(),
                'status' => 422,
            ], 422);
        }

        $book = Book::create($request->all());

        return response()->json([
            'message' => 'Livro cadastrado com sucesso',
            'data' => $book,
            'status' => 201,
        ], 201);
    }

    // Mostrar livro por ID
    public function show($id)
    {
        $book = Book::where('id', $id)->whereNull('deleted_at')->first();

        if (!$book) {
            return response()->json([
                'message' => 'Livro não encontrado',
                'status' => 404,
            ], 404);
        }

        return response()->json([
            'message' => 'Livro encontrado',
            'data' => $book,
            'status' => 200,
        ], 200);
    }

    // Atualizar livro
    public function update(Request $request, $id)
    {
        $book = Book::where('id', $id)->whereNull('deleted_at')->first();

        if (!$book) {
            return response()->json([
                'message' => 'Livro não encontrado',
                'status' => 404,
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'author' => 'nullable|string|max:255',
            'publisher_id' => 'nullable|exists:publishers,id',
            'publication_year' => 'nullable|integer',
            'synopsis' => 'nullable|string',
            'cover_image' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Erro nas informações do livro',
                'data' => $validator->errors(),
                'status' => 422,
            ], 422);
        }

        $book->update($request->all());

        return response()->json([
            'message' => 'Livro atualizado com sucesso',
            'data' => $book,
            'status' => 200,
        ], 200);
    }

    // Deletar livro (Soft Delete)
    public function destroy($id)
    {
        $book = Book::where('id', $id)->whereNull('deleted_at')->first();

        if (!$book) {
            return response()->json([
                'message' => 'Livro não encontrado',
                'status' => 404,
            ], 404);
        }

        $book->delete();

        return response()->json([
            'message' => 'Livro deletado com sucesso',
            'status' => 200,
        ], 200);
    }
}
