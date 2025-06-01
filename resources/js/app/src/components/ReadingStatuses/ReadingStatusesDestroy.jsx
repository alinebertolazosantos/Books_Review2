// frontend/src/components/ReadingStatuses/ReadingStatusesDestroy.jsx

import React, { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import DeleteConfirmationModal from "../DeleteConfirmationModal"; // Importa o modal de confirmação
import "./ReadingStatusesDestroy.css"; // Importa o CSS específico para este componente

const ReadingStatusesDestroy = ({ statusId, statusName, onStatusRemoved }) => {
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
            // Envia requisição DELETE para o endpoint do Laravel para remover um status de leitura.
            // Exemplo da sua API: DELETE /api/reading-statuses/{id}
            const response = await axios.delete(
                `${API_BASE_URL}/reading-statuses/${statusId}`
            );

            // Notifica o componente pai sobre a remoção do status de leitura.
            if (onStatusRemoved) {
                onStatusRemoved(statusId);
            }
            alert(
                response.data.message ||
                    `Status de leitura '${statusName}' removido com sucesso!`
            );
            setIsModalOpen(false); // Fecha o modal.
        } catch (err) {
            console.error(
                "Erro ao remover status de leitura:",
                err.response?.data || err.message
            );
            setError(
                err.response?.data?.message ||
                    "Erro ao remover status de leitura. Tente novamente."
            );
            alert(
                "Erro: " +
                    (err.response?.data?.message ||
                        "Não foi possível remover o status de leitura.")
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
                className="reading-status-destroy-button" // Classe CSS para este botão
                title={`Remover o status de leitura "${statusName}"`}
            >
                {loading ? "Removendo..." : "Excluir Status"}
            </button>
            {/* Modal de confirmação exibido quando ativado. */}
            <DeleteConfirmationModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmDelete}
                itemName={statusName} // Passa o nome do status para a mensagem do modal.
            />
            {/* Exibe mensagem de erro, se houver. */}
            {error && (
                <p className="reading-status-destroy-error">{error}</p>
            )}{" "}
        </>
    );
};

// Validação das propriedades recebidas pelo componente.
ReadingStatusesDestroy.propTypes = {
    statusId: PropTypes.number.isRequired,
    statusName: PropTypes.string.isRequired, // Assume que você tem um nome para o status (e.g., "Lido", "Lendo")
    onStatusRemoved: PropTypes.func, // Função opcional para notificar o pai sobre a remoção.
};

export default ReadingStatusesDestroy;
