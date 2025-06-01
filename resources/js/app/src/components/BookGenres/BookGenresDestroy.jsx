// frontend/src/components/BookGenres/BookGenresDestroy.jsx

import React, { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import DeleteConfirmationModal from "../DeleteConfirmationModal"; // Importa o modal de confirmação
import "../BookGenresDestroy.css"; // Importa o CSS específico

const BookGenresDestroy = ({ bookId, genreId, genreName, onGenreRemoved }) => {
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
            // Envia requisição DELETE para remover a associação do gênero ao livro.
            const response = await axios.delete(
                `${API_BASE_URL}/books/${bookId}/genres/${genreId}`
            );

            // Notifica o componente pai sobre a remoção.
            if (onGenreRemoved) {
                onGenreRemoved(genreId);
            }
            alert(
                response.data.message ||
                `Gênero '${genreName}' removido do livro com sucesso!`
            );
            setIsModalOpen(false); // Fecha o modal.
        } catch (err) {
            console.error(
                "Erro ao remover gênero do livro:",
                err.response?.data || err.message
            );
            setError(
                err.response?.data?.message ||
                "Erro ao remover gênero. Tente novamente."
            );
            alert(
                "Erro: " +
                (err.response?.data?.message ||
                    "Não foi possível remover o gênero.")
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
                className="book-genre-destroy-button"
                title={`Remover o gênero "${genreName}" deste livro`}
            >
                {loading ? "Removendo..." : "Excluir Gênero"}
            </button>
            {/* Modal de confirmação exibido quando ativado. */}
            <DeleteConfirmationModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmDelete}
                itemName={genreName}
            />
            {/* Exibe mensagem de erro, se houver. */}
            {error && <p className="book-genre-destroy-error">{error}</p>}{" "}
        </>
    );
};

// Validação das propriedades recebidas pelo componente.
BookGenresDestroy.propTypes = {
    bookId: PropTypes.number.isRequired,
    genreId: PropTypes.number.isRequired,
    genreName: PropTypes.string.isRequired,
    onGenreRemoved: PropTypes.func,
};

export default BookGenresDestroy;