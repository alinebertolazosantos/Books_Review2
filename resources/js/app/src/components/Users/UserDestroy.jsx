// frontend/src/components/Users/UserDestroy.jsx

import React, { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import DeleteConfirmationModal from "../DeleteConfirmationModal"; // Importa o modal de confirmação
import "./UserDestroy.css"; // Importa o CSS específico para este componente

const UserDestroy = ({ userId, userName, onUserRemoved }) => {
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
            // Envia requisição DELETE para o endpoint do Laravel para remover um usuário.
            // Exemplo da sua API: DELETE /api/users/{id}
            const response = await axios.delete(
                `${API_BASE_URL}/users/${userId}`
            );

            // Notifica o componente pai sobre a remoção do usuário.
            if (onUserRemoved) {
                onUserRemoved(userId);
            }
            alert(
                response.data.message ||
                    `Usuário '${userName}' removido com sucesso!`
            );
            setIsModalOpen(false); // Fecha o modal.
        } catch (err) {
            console.error(
                "Erro ao remover usuário:",
                err.response?.data || err.message
            );
            setError(
                err.response?.data?.message ||
                    "Erro ao remover usuário. Tente novamente."
            );
            alert(
                "Erro: " +
                    (err.response?.data?.message ||
                        "Não foi possível remover o usuário.")
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
                className="user-destroy-button" // Classe CSS para este botão
                title={`Remover o usuário "${userName}"`}
            >
                {loading ? "Removendo..." : "Excluir Usuário"}
            </button>
            {/* Modal de confirmação exibido quando ativado. */}
            <DeleteConfirmationModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmDelete}
                itemName={userName} // Passa o nome do usuário para a mensagem do modal.
            />
            {/* Exibe mensagem de erro, se houver. */}
            {error && <p className="user-destroy-error">{error}</p>}{" "}
        </>
    );
};

// Validação das propriedades recebidas pelo componente.
UserDestroy.propTypes = {
    userId: PropTypes.number.isRequired,
    userName: PropTypes.string.isRequired,
    onUserRemoved: PropTypes.func, // Função opcional para notificar o pai sobre a remoção.
};

export default UserDestroy;
