// frontend/src/components/ReadingStatuses/ReadingStatusesList.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Para navegar para detalhes/edição/criação
import ReadingStatusesDestroy from "./ReadingStatusesDestroy"; // Importa o componente para exclusão de status
import "./ReadingStatusesList.css"; // Importa o CSS específico para esta lista

const ReadingStatusesList = () => {
    const [readingStatuses, setReadingStatuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // URL base da API Laravel.
    const API_BASE_URL = "http://localhost:8000/api";

    useEffect(() => {
        // Busca os status de leitura ao montar o componente.
        fetchReadingStatuses();
    }, []);

    const fetchReadingStatuses = async () => {
        setLoading(true);
        setError(null);
        try {
            // Requisição GET para listar todos os status de leitura.
            const response = await axios.get(
                `${API_BASE_URL}/reading-statuses`
            );
            setReadingStatuses(response.data);
        } catch (err) {
            console.error(
                "Erro ao buscar status de leitura:",
                err.response?.data || err.message
            );
            setError("Erro ao carregar status de leitura. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusRemoved = (removedStatusId) => {
        // Filtra o status de leitura removido da lista para atualizar a UI.
        setReadingStatuses((prevStatuses) =>
            prevStatuses.filter((status) => status.id !== removedStatusId)
        );
    };

    // Exibe estado de carregamento.
    if (loading) {
        return (
            <div className="reading-status-list-loading">
                Carregando status de leitura...
            </div>
        );
    }

    // Exibe mensagem de erro.
    if (error) {
        return <div className="reading-status-list-error">{error}</div>;
    }

    return (
        <div className="reading-status-list-container">
            <h1 className="reading-status-list-title">
                Meus Status de Leitura
            </h1>

            {/* Link para a página de criação de um novo status de leitura. */}
            <Link
                to="/reading-statuses/create"
                className="reading-status-list-add-button"
            >
                Adicionar Novo Status
            </Link>

            {readingStatuses.length === 0 ? (
                <p className="reading-status-list-no-data">
                    Nenhum status de leitura encontrado. Que tal adicionar um?
                </p>
            ) : (
                <ul className="reading-status-list">
                    {readingStatuses.map((status) => (
                        <li
                            key={status.id}
                            className="reading-status-list-item"
                        >
                            <div className="reading-status-item-info">
                                {/* Exibe o nome do status e informações do livro/usuário, se existirem */}
                                <span className="reading-status-item-name">
                                    {status.status_name}
                                </span>
                                {status.book && status.user && (
                                    <span className="reading-status-item-book-user">
                                        para "{status.book.title}" por{" "}
                                        {status.user.name}
                                    </span>
                                )}
                            </div>
                            <div className="reading-status-list-actions">
                                {/* Link para os detalhes do status. */}
                                <Link
                                    to={`/reading-statuses/${status.id}`}
                                    className="reading-status-list-button details"
                                >
                                    Detalhes
                                </Link>
                                {/* Link para a edição do status. */}
                                <Link
                                    to={`/reading-statuses/${status.id}/edit`}
                                    className="reading-status-list-button edit"
                                >
                                    Editar
                                </Link>
                                {/* Componente de exclusão do status. */}
                                <ReadingStatusesDestroy
                                    statusId={status.id}
                                    statusName={status.status_name}
                                    onStatusRemoved={handleStatusRemoved}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ReadingStatusesList;
    