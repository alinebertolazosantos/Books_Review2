// frontend/src/components/Reviews/ReviewsList.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Para navegar para detalhes/edição/criação
import ReviewsDestroy from "./ReviewsDestroy"; // Importa o componente para exclusão de avaliação
import "./ReviewsList.css"; // Importa o CSS específico para esta lista

const ReviewsList = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // URL base da API Laravel.
    const API_BASE_URL = "http://localhost:8000/api";

    useEffect(() => {
        // Busca as avaliações ao montar o componente.
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        setLoading(true);
        setError(null);
        try {
            // Requisição GET para listar todas as avaliações.
            const response = await axios.get(`${API_BASE_URL}/reviews`);
            setReviews(response.data);
        } catch (err) {
            console.error(
                "Erro ao buscar avaliações:",
                err.response?.data || err.message
            );
            setError("Erro ao carregar avaliações. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const handleReviewRemoved = (removedReviewId) => {
        // Filtra a avaliação removida da lista para atualizar a UI.
        setReviews((prevReviews) =>
            prevReviews.filter((review) => review.id !== removedReviewId)
        );
    };

    // Função auxiliar para criar um resumo da avaliação para o modal de exclusão.
    const getReviewSummary = (review) => {
        const bookTitle = review.book
            ? review.book.title
            : "Livro Desconhecido";
        const userName = review.user
            ? review.user.name
            : "Usuário Desconhecido";
        return `${review.rating} estrelas em "${bookTitle}" por ${userName}`;
    };

    // Exibe estado de carregamento.
    if (loading) {
        return (
            <div className="reviews-list-loading">Carregando avaliações...</div>
        );
    }

    // Exibe mensagem de erro.
    if (error) {
        return <div className="reviews-list-error">{error}</div>;
    }

    return (
        <div className="reviews-list-container">
            <h1 className="reviews-list-title">Minhas Avaliações</h1>

            {/* Link para a página de criação de uma nova avaliação. */}
            <Link to="/reviews/create" className="reviews-list-add-button">
                Adicionar Nova Avaliação
            </Link>

            {reviews.length === 0 ? (
                <p className="reviews-list-no-data">
                    Nenhuma avaliação encontrada. Que tal adicionar uma?
                </p>
            ) : (
                <ul className="reviews-list">
                    {reviews.map((review) => (
                        <li key={review.id} className="reviews-list-item">
                            <div className="review-item-info">
                                {/* Exibe a classificação e o comentário. */}
                                <span className="review-item-rating">
                                    {review.rating} estrelas
                                </span>
                                <span className="review-item-comment">
                                    "{review.comment}"
                                </span>
                                {/* Exibe informações do livro e usuário, se existirem. */}
                                {review.book && review.user && (
                                    <span className="review-item-book-user">
                                        em "{review.book.title}" por{" "}
                                        {review.user.name}
                                    </span>
                                )}
                            </div>
                            <div className="review-list-actions">
                                {/* Link para os detalhes da avaliação. */}
                                <Link
                                    to={`/reviews/${review.id}`}
                                    className="review-list-button details"
                                >
                                    Detalhes
                                </Link>
                                {/* Link para a edição da avaliação. */}
                                <Link
                                    to={`/reviews/${review.id}/edit`}
                                    className="review-list-button edit"
                                >
                                    Editar
                                </Link>
                                {/* Componente de exclusão da avaliação. */}
                                <ReviewsDestroy
                                    reviewId={review.id}
                                    reviewSummary={getReviewSummary(review)} // Passa um resumo
                                    onReviewRemoved={handleReviewRemoved}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ReviewsList;
