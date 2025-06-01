// frontend/src/components/Reviews/ReviewsDestroy.jsx

import React, { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import DeleteConfirmationModal from "../DeleteConfirmationModal"; // Importa o modal de confirmação
import "./ReviewsDestroy.css"; // Importa o CSS específico para este componente

const ReviewsDestroy = ({ reviewId, reviewSummary, onReviewRemoved }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // URL base da API Laravel.
    const API_BASE_URL = "http://localhost:8000/api";

    const handleDeleteClick = () => {
        // Abre o modal de confirmação.
        setIsModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        setLoading(true);
        setError(null);
        try {
            // Envia requisição DELETE para o endpoint do Laravel para remover uma avaliação.
            // Exemplo da sua API: DELETE /api/reviews/{id}
            const response = await axios.delete(
                `${API_BASE_URL}/reviews/${reviewId}`
            );

            // Notifica o componente pai sobre a remoção da avaliação.
            if (onReviewRemoved) {
                onReviewRemoved(reviewId);
            }
            alert(
                response.data.message ||
                    `Avaliação '${reviewSummary}' removida com sucesso!`
            );
            setIsModalOpen(false); // Fecha o modal.
        } catch (err) {
            console.error(
                "Erro ao remover avaliação:",
                err.response?.data || err.message
            );
            setError(
                err.response?.data?.message ||
                    "Erro ao remover avaliação. Tente novamente."
            );
            alert(
                "Erro: " +
                    (err.response?.data?.message ||
                        "Não foi possível remover a avaliação.")
            );
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        // Fecha o modal e limpa erros.
        setIsModalOpen(false);
        setError(null);
    };

    return (
        <>
            <button
                onClick={handleDeleteClick}
                disabled={loading}
                className="review-destroy-button" // Classe CSS para este botão
                title={`Remover a avaliação: ${reviewSummary}`}
            >
                {loading ? "Removendo..." : "Excluir Avaliação"}
            </button>
            {/* Modal de confirmação exibido quando ativado. */}
            <DeleteConfirmationModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmDelete}
                itemName={reviewSummary} // Passa o resumo da avaliação para a mensagem do modal.
            />
            {/* Exibe mensagem de erro, se houver. */}
            {error && <p className="review-destroy-error">{error}</p>}{" "}
        </>
    );
};

// Validação das propriedades recebidas pelo componente.
ReviewsDestroy.propTypes = {
    reviewId: PropTypes.number.isRequired,
    reviewSummary: PropTypes.string.isRequired, // Um resumo da avaliação (e.g., "5 estrelas em Livro X")
    onReviewRemoved: PropTypes.func, // Função opcional para notificar o pai sobre a remoção.
};

export default ReviewsDestroy;
