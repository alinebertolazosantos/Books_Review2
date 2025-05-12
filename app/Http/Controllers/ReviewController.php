<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    public function index(Request $request)
    {
        $reviews = Review::whereNull('deleted_at')->get();

        if ($reviews->isEmpty()) {
            return response()->json([
                'message' => 'Nenhuma resenha encontrada.',
                'status' => 404
            ], 404);
        }

        return response()->json([
            'message' => 'Lista de resenhas',
            'data' => $reviews,
            'status' => 200,
        ], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'book_id' => 'required|exists:books,id',
            'review_text' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Erro nas informações da resenha.',
                'data' => $validator->errors(),
                'status' => 422,
            ], 422);
        }

        $review = Review::create([
            'book_id' => $request->book_id,
            'review_text' => $request->review_text,
            'rating' => $request->rating,
        ]);

        return response()->json([
            'message' => 'Resenha criada com sucesso.',
            'data' => $review,
            'status' => 201,
        ], 201);
    }

    public function show($id)
    {
        $review = Review::where('id', $id)->whereNull('deleted_at')->first();

        if (!$review) {
            return response()->json([
                'message' => 'Resenha não encontrada.',
                'status' => 404,
            ], 404);
        }

        return response()->json([
            'message' => 'Resenha encontrada.',
            'data' => $review,
            'status' => 200,
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $review = Review::where('id', $id)->whereNull('deleted_at')->first();

        if (!$review) {
            return response()->json([
                'message' => 'Resenha não encontrada.',
                'status' => 404,
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'review_text' => 'sometimes|string',
            'rating' => 'sometimes|integer|min:1|max:5',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Erro de validação',
                'data' => $validator->errors(),
                'status' => 422,
            ], 422);
        }

        if ($request->has('review_text')) {
            $review->review_text = $request->review_text;
        }
        if ($request->has('rating')) {
            $review->rating = $request->rating;
        }

        $review->save();

        return response()->json([
            'message' => 'Resenha atualizada com sucesso.',
            'data' => $review,
            'status' => 200,
        ], 200);
    }

    public function destroy($id)
    {
        $review = Review::where('id', $id)->whereNull('deleted_at')->first();

        if (!$review) {
            return response()->json([
                'message' => 'Resenha não encontrada.',
                'status' => 404,
            ], 404);
        }

        $review->delete();

        return response()->json([
            'message' => 'Resenha deletada com sucesso.',
            'status' => 200,
        ], 200);
    }
}
