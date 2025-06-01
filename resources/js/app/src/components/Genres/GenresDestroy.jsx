// frontend/src/components/Genres/GenresDestroy.jsx

import React, { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import DeleteConfirmationModal from "../DeleteConfirmationModal"; // Importa o modal de confirmação (caminho relativo)
import "./GenresDestroy.css"; // Importa o CSS específico para este componente

const GenresDestroy = ({ genreId, genreName, onGenreRemoved }) => {
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
            // Envia requisição DELETE para o endpoint do Laravel para remover um GÊNERO.
            // Exemplo da sua API: DELETE /api/genres/{genre}
            const response = await axios.delete(
                `${API_BASE_URL}/genres/${genreId}`
            );

            // Notifica o componente pai sobre a remoção do gênero.
            if (onGenreRemoved) {
                onGenreRemoved(genreId);
            }
            alert(
                response.data.message ||
                    `Gênero '${genreName}' removido com sucesso!`
            );
            setIsModalOpen(false); // Fecha o modal.
        } catch (err) {
            console.error(
                "Erro ao remover gênero:",
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
                className="genre-destroy-button" // Classe CSS para este botão
                title={`Remover o gênero "${genreName}"`}
            >
                {loading ? "Removendo..." : "Excluir Gênero"}
            </button>
            {/* Modal de confirmação exibido quando ativado. */}
            <DeleteConfirmationModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmDelete}
                itemName={genreName} // Passa o nome do gênero para a mensagem do modal.
            />
            {/* Exibe mensagem de erro, se houver. */}
            {error && <p className="genre-destroy-error">{error}</p>}{" "}
        </>
    );
};

// Validação das propriedades recebidas pelo componente.
GenresDestroy.propTypes = {
    genreId: PropTypes.number.isRequired,
    genreName: PropTypes.string.isRequired,
    onGenreRemoved: PropTypes.func, // Função opcional para notificar o pai sobre a remoção.
};

export default GenresDestroy;
