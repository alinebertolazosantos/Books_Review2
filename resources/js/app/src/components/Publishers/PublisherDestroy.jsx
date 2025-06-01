// frontend/src/components/Publishers/PublisherDestroy.jsx

import React, { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import DeleteConfirmationModal from "../DeleteConfirmationModal"; // Importa o modal de confirmação
import "./PublisherDestroy.css"; // Importa o CSS específico para este componente

const PublisherDestroy = ({
    publisherId,
    publisherName,
    onPublisherRemoved,
}) => {
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
            // Envia requisição DELETE para o endpoint do Laravel para remover uma editora.
            // Exemplo da sua API: DELETE /api/publishers/{publisher}
            const response = await axios.delete(
                `${API_BASE_URL}/publishers/${publisherId}`
            );

            // Notifica o componente pai sobre a remoção da editora.
            if (onPublisherRemoved) {
                onPublisherRemoved(publisherId);
            }
            alert(
                response.data.message ||
                    `Editora '${publisherName}' removida com sucesso!`
            );
            setIsModalOpen(false); // Fecha o modal.
        } catch (err) {
            console.error(
                "Erro ao remover editora:",
                err.response?.data || err.message
            );
            setError(
                err.response?.data?.message ||
                    "Erro ao remover editora. Tente novamente."
            );
            alert(
                "Erro: " +
                    (err.response?.data?.message ||
                        "Não foi possível remover a editora.")
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
                className="publisher-destroy-button" // Classe CSS para este botão
                title={`Remover a editora "${publisherName}"`}
            >
                {loading ? "Removendo..." : "Excluir Editora"}
            </button>
            {/* Modal de confirmação exibido quando ativado. */}
            <DeleteConfirmationModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmDelete}
                itemName={publisherName} // Passa o nome da editora para a mensagem do modal.
            />
            {/* Exibe mensagem de erro, se houver. */}
            {error && <p className="publisher-destroy-error">{error}</p>}{" "}
        </>
    );
};

// Validação das propriedades recebidas pelo componente.
PublisherDestroy.propTypes = {
    publisherId: PropTypes.number.isRequired,
    publisherName: PropTypes.string.isRequired,
    onPublisherRemoved: PropTypes.func, // Função opcional para notificar o pai sobre a remoção.
};

export default PublisherDestroy;
    