// frontend/src/components/ReadingStatuses/ReadingStatusesDetails.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom"; // Para pegar o ID da URL, navegar e criar links
import PropTypes from "prop-types"; // Para validação de props
import ReadingStatusesDestroy from "./ReadingStatusesDestroy"; // Importa o componente para exclusão do status
import "./ReadingStatusesDetails.css"; // Importa o CSS específico para este componente

const ReadingStatusesDetails = () => {
    // Pega o 'id' (statusId) da URL.
    const { id: statusId } = useParams();
    const navigate = useNavigate(); // Para navegar após a exclusão ou edição.

    const [readingStatus, setReadingStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // URL base da API Laravel.
    const API_BASE_URL = "http://localhost:8000/api";

    useEffect(() => {
        // Função para buscar os detalhes do status de leitura.
        const fetchReadingStatusDetails = async () => {
            if (!statusId) {
                setError("ID do status de leitura não fornecido.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                // Requisição GET para buscar os detalhes do status de leitura específico.
                const response = await axios.get(
                    `${API_BASE_URL}/reading-statuses/${statusId}`
                );
                setReadingStatus(response.data);
            } catch (err) {
                console.error(
                    "Erro ao buscar detalhes do status de leitura:",
                    err.response?.data || err.message
                );
                setError(
                    err.response?.data?.message ||
                        "Erro ao carregar detalhes do status de leitura."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchReadingStatusDetails();
    }, [statusId]); // Re-executa o efeito se o statusId mudar.

    const handleStatusRemoved = () => {
        // Navega para a lista de status de leitura após a remoção bem-sucedida.
        navigate("/reading-statuses");
        alert("Status de leitura removido com sucesso!");
    };

    // Exibe estado de carregamento.
    if (loading) {
        return (
            <div className="reading-status-details-loading">
                Carregando detalhes do status...
            </div>
        );
    }

    // Exibe mensagem de erro.
    if (error) {
        return <div className="reading-status-details-error">{error}</div>;
    }

    // Exibe mensagem se o status não for encontrado.
    if (!readingStatus) {
        return (
            <div className="reading-status-details-not-found">
                Status de leitura não encontrado.
            </div>
        );
    }

    return (
        <div className="reading-status-details-container">
            <h1 className="reading-status-details-title">
                {readingStatus.status_name}
            </h1>{" "}
            {/* Assumindo 'status_name' */}
            <div className="reading-status-details-info">
                <p>
                    <strong>ID:</strong> {readingStatus.id}
                </p>
                {/* Exemplo de exibição de livro e usuário associados ao status, se o endpoint retornar */}
                {readingStatus.book && (
                    <p>
                        <strong>Livro:</strong>{" "}
                        <Link to={`/books/${readingStatus.book.id}`}>
                            {readingStatus.book.title}
                        </Link>{" "}
                        por {readingStatus.book.author}
                    </p>
                )}
                {readingStatus.user && (
                    <p>
                        <strong>Usuário:</strong>{" "}
                        <Link to={`/users/${readingStatus.user.id}`}>
                            {readingStatus.user.name}
                        </Link>
                    </p>
                )}
                {readingStatus.completion_date && (
                    <p>
                        <strong>Data de Conclusão:</strong>{" "}
                        {new Date(
                            readingStatus.completion_date
                        ).toLocaleDateString()}
                    </p>
                )}
                {readingStatus.notes && (
                    <p className="reading-status-details-notes">
                        <strong>Notas:</strong> {readingStatus.notes}
                    </p>
                )}
            </div>
            <div className="reading-status-details-actions">
                {/* Botão para editar o status de leitura. */}
                <Link
                    to={`/reading-statuses/${readingStatus.id}/edit`}
                    className="reading-status-details-button edit"
                >
                    Editar Status
                </Link>
                {/* Componente para exclusão do status de leitura. */}
                <ReadingStatusesDestroy
                    statusId={readingStatus.id}
                    statusName={readingStatus.status_name}
                    onStatusRemoved={handleStatusRemoved}
                />
                {/* Botão para voltar à lista de status de leitura. */}
                <button
                    onClick={() => navigate("/reading-statuses")}
                    className="reading-status-details-button back"
                >
                    Voltar para a Lista
                </button>
            </div>
        </div>
    );
};

// Validação das propriedades (statusId é obtido via useParams).
ReadingStatusesDetails.propTypes = {
    // Componente obtém o ID via useParams, não diretamente via props.
};

export default ReadingStatusesDetails;
