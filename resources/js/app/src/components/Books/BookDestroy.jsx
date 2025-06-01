// frontend/src/components/Books/BookDestroy.jsx

import React, { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import DeleteConfirmationModal from "../DeleteConfirmationModal"; // Importa o modal de confirmação
import "./BookDestroy.css"; // Importa o CSS específico para este componente

const BookDestroy = ({ bookId, bookTitle, onBookRemoved }) => {
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
            // Envia requisição DELETE para o endpoint do Laravel para remover um livro.
            // Exemplo da sua API: DELETE /api/books/{book}
            const response = await axios.delete(
                `${API_BASE_URL}/books/${bookId}`
            );

            // Notifica o componente pai sobre a remoção do livro.
            if (onBookRemoved) {
                onBookRemoved(bookId);
            }
            alert(
                response.data.message ||
                    `Livro '${bookTitle}' removido com sucesso!`
            );
            setIsModalOpen(false); // Fecha o modal.
        } catch (err) {
            console.error(
                "Erro ao remover livro:",
                err.response?.data || err.message
            );
            setError(
                err.response?.data?.message ||
                    "Erro ao remover livro. Tente novamente."
            );
            alert(
                "Erro: " +
                    (err.response?.data?.message ||
                        "Não foi possível remover o livro.")
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
                className="book-destroy-button" // Classe CSS para este botão
                title={`Remover o livro "${bookTitle}"`}
            >
                {loading ? "Removendo..." : "Excluir Livro"}
            </button>
            {/* Modal de confirmação exibido quando ativado. */}
            <DeleteConfirmationModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmDelete}
                itemName={bookTitle} // Passa o título do livro para a mensagem do modal.
            />
            {/* Exibe mensagem de erro, se houver. */}
            {error && <p className="book-destroy-error">{error}</p>}{" "}
        </>
    );
};

// Validação das propriedades recebidas pelo componente.
BookDestroy.propTypes = {
    bookId: PropTypes.number.isRequired,
    bookTitle: PropTypes.string.isRequired,
    onBookRemoved: PropTypes.func, // Função opcional para notificar o pai sobre a remoção.
};

export default BookDestroy;
