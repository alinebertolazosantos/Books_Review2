// frontend/src/components/Reviews/ReviewsDetails.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom"; // Para pegar o ID da URL, navegar e criar links
import PropTypes from "prop-types"; // Para validação de props
import ReviewsDestroy from "./ReviewsDestroy"; // Importa o componente para exclusão da avaliação
import "./ReviewsDetails.css"; // Importa o CSS específico para este componente

const ReviewsDetails = () => {
    // Pega o 'id' (reviewId) da URL.
    const { id: reviewId } = useParams();
    const navigate = useNavigate(); // Para navegar após a exclusão ou edição.

    const [review, setReview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // URL base da API Laravel.
    const API_BASE_URL = "http://localhost:8000/api";

    useEffect(() => {
        // Função para buscar os detalhes da avaliação.
        const fetchReviewDetails = async () => {
            if (!reviewId) {
                setError("ID da avaliação não fornecido.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                // Requisição GET para buscar os detalhes da avaliação específica.
                const response = await axios.get(
                    `${API_BASE_URL}/reviews/${reviewId}`
                );
                setReview(response.data);
            } catch (err) {
                console.error(
                    "Erro ao buscar detalhes da avaliação:",
                    err.response?.data || err.message
                );
                setError(
                    err.response?.data?.message ||
                        "Erro ao carregar detalhes da avaliação."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchReviewDetails();
    }, [reviewId]); // Re-executa o efeito se o reviewId mudar.

    const handleReviewRemoved = () => {
        // Navega para a lista de avaliações após a remoção bem-sucedida.
        navigate("/reviews");
        alert("Avaliação removida com sucesso!");
    };

    // Função auxiliar para criar um resumo da avaliação para o componente ReviewsDestroy
    const getReviewSummary = (reviewData) => {
        const bookTitle = reviewData.book
            ? reviewData.book.title
            : "Livro Desconhecido";
        const userName = reviewData.user
            ? reviewData.user.name
            : "Usuário Desconhecido";
        return `${reviewData.rating} estrelas em "${bookTitle}" por ${userName}`;
    };

    // Exibe estado de carregamento.
    if (loading) {
        return (
            <div className="review-details-loading">
                Carregando detalhes da avaliação...
            </div>
        );
    }

    // Exibe mensagem de erro.
    if (error) {
        return <div className="review-details-error">{error}</div>;
    }

    // Exibe mensagem se a avaliação não for encontrada.
    if (!review) {
        return (
            <div className="review-details-not-found">
                Avaliação não encontrada.
            </div>
        );
    }

    return (
        <div className="review-details-container">
            <h1 className="review-details-title">Avaliação do Livro</h1>
            <div className="review-details-info">
                <p>
                    <strong>ID da Avaliação:</strong> {review.id}
                </p>
                <p>
                    <strong>Classificação:</strong> {review.rating} estrelas
                </p>

                {/* Exibe o livro associado, se existir. */}
                {review.book && (
                    <p>
                        <strong>Livro:</strong>{" "}
                        <Link to={`/books/${review.book.id}`}>
                            {review.book.title}
                        </Link>{" "}
                        por {review.book.author}
                    </p>
                )}

                {/* Exibe o usuário que fez a avaliação, se existir. */}
                {review.user && (
                    <p>
                        <strong>Avaliado por:</strong>{" "}
                        <Link to={`/users/${review.user.id}`}>
                            {review.user.name}
                        </Link>
                    </p>
                )}

                {/* Exibe o comentário da avaliação. */}
                <p className="review-details-comment">
                    <strong>Comentário:</strong>{" "}
                    {review.comment || "Sem comentário."}
                </p>

                {/* Exibe data de criação/atualização se disponível na API. */}
                {review.created_at && (
                    <p>
                        <strong>Criada em:</strong>{" "}
                        {new Date(review.created_at).toLocaleDateString()}
                    </p>
                )}
                {review.updated_at && (
                    <p>
                        <strong>Última atualização:</strong>{" "}
                        {new Date(review.updated_at).toLocaleDateString()}
                    </p>
                )}
            </div>

            <div className="review-details-actions">
                {/* Botão para editar a avaliação. */}
                <Link
                    to={`/reviews/${review.id}/edit`}
                    className="review-details-button edit"
                >
                    Editar Avaliação
                </Link>
                {/* Componente para exclusão da avaliação. */}
                <ReviewsDestroy
                    reviewId={review.id}
                    reviewSummary={getReviewSummary(review)} // Passa um resumo da avaliação
                    onReviewRemoved={handleReviewRemoved}
                />
                {/* Botão para voltar à lista de avaliações. */}
                <button
                    onClick={() => navigate("/reviews")}
                    className="review-details-button back"
                >
                    Voltar para a Lista
                </button>
            </div>
        </div>
    );
};

// Validação das propriedades (reviewId é obtido via useParams).
ReviewsDetails.propTypes = {
    // Componente obtém o ID via useParams, não diretamente via props.
};

export default ReviewsDetails;
