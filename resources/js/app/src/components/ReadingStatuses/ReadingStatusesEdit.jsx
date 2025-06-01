// frontend/src/components/ReadingStatuses/ReadingStatusesEdit.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // Para pegar o ID da URL e navegar
import PropTypes from "prop-types"; // Para validação de props
import "./ReadingStatusesEdit.css"; // Importa o CSS específico para este componente

const ReadingStatusesEdit = () => {
    // Pega o 'id' (statusId) da URL, se existir.
    const { id: statusId } = useParams();
    const navigate = useNavigate(); // Para navegar após a operação.

    // Estados para os campos do formulário do status de leitura.
    const [userId, setUserId] = useState("");
    const [bookId, setBookId] = useState("");
    const [statusName, setStatusName] = useState(""); // Ex: "Lido", "Lendo", "Quero Ler"
    const [completionDate, setCompletionDate] = useState(""); // Data de conclusão
    const [notes, setNotes] = useState("");

    const [users, setUsers] = useState([]); // Lista de usuários para um select
    const [books, setBooks] = useState([]); // Lista de livros para um select

    const [loading, setLoading] = useState(true); // Controla o carregamento inicial (para edição)
    const [submitting, setSubmitting] = useState(false); // Controla o estado de envio do formulário
    const [error, setError] = useState(null); // Para mensagens de erro

    // Determina se estamos editando ou criando.
    const isEditing = Boolean(statusId);

    // URL base da API Laravel.
    const API_BASE_URL = "http://localhost:8000/api";

    useEffect(() => {
        // Função para buscar usuários e livros (para os campos de seleção).
        const fetchDataForSelects = async () => {
            try {
                const [usersResponse, booksResponse] = await Promise.all([
                    axios.get(`${API_BASE_URL}/users`),
                    axios.get(`${API_BASE_URL}/books`),
                ]);
                setUsers(usersResponse.data);
                setBooks(booksResponse.data);
            } catch (err) {
                console.error(
                    "Erro ao carregar dados para seleção:",
                    err.response?.data || err.message
                );
                setError("Erro ao carregar usuários ou livros.");
            }
        };

        // Se estiver editando, busca os detalhes do status de leitura existente.
        const fetchReadingStatus = async () => {
            if (!isEditing) {
                setLoading(false); // Se não estiver editando, não precisa carregar dados existentes.
                return;
            }

            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/reading-statuses/${statusId}`
                );
                const statusData = response.data;
                setUserId(statusData.user_id || "");
                setBookId(statusData.book_id || "");
                setStatusName(statusData.status_name || "");
                // Formata a data para 'YYYY-MM-DD' para o input type="date".
                setCompletionDate(
                    statusData.completion_date
                        ? new Date(statusData.completion_date)
                              .toISOString()
                              .split("T")[0]
                        : ""
                );
                setNotes(statusData.notes || "");
            } catch (err) {
                console.error(
                    "Erro ao buscar status de leitura para edição:",
                    err.response?.data || err.message
                );
                setError("Erro ao carregar dados do status. Tente novamente.");
            } finally {
                setLoading(false);
            }
        };

        fetchDataForSelects(); // Carrega dados para os selects.
        fetchReadingStatus(); // Busca dados do status apenas se estiver editando.
    }, [statusId, isEditing]); // Re-executa se o ID ou o modo de edição mudar.

    const handleSubmit = async (e) => {
        e.preventDefault(); // Previne o comportamento padrão de recarregar a página.

        setSubmitting(true);
        setError(null); // Limpa erros anteriores.

        try {
            const readingStatusData = {
                user_id: userId,
                book_id: bookId,
                status_name: statusName,
                completion_date: completionDate || null, // Garante null se vazio
                notes: notes || null, // Garante null se vazio
                // Adicione outros campos, se houver.
            };

            if (isEditing) {
                // Requisição PUT/PATCH para atualizar um status de leitura existente.
                await axios.put(
                    `${API_BASE_URL}/reading-statuses/${statusId}`,
                    readingStatusData
                );
                alert("Status de leitura atualizado com sucesso!");
            } else {
                // Requisição POST para criar um novo status de leitura.
                await axios.post(
                    `${API_BASE_URL}/reading-statuses`,
                    readingStatusData
                );
                alert("Status de leitura criado com sucesso!");
            }
            navigate("/reading-statuses"); // Navega de volta para a lista após sucesso.
        } catch (err) {
            console.error(
                "Erro ao salvar status de leitura:",
                err.response?.data || err.message
            );
            setError(
                err.response?.data?.message ||
                    "Erro ao salvar status de leitura. Verifique os dados."
            );
        } finally {
            setSubmitting(false);
        }
    };

    // Exibe estado de carregamento.
    if (loading) {
        return (
            <div className="reading-status-edit-loading">
                Carregando formulário...
            </div>
        );
    }

    return (
        <div className="reading-status-edit-container">
            <h1 className="reading-status-edit-title">
                {isEditing
                    ? "Editar Status de Leitura"
                    : "Criar Novo Status de Leitura"}
            </h1>

            <form onSubmit={handleSubmit} className="reading-status-edit-form">
                <div className="form-group">
                    <label htmlFor="userId">Usuário:</label>
                    <select
                        id="userId"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        required
                        className="form-select"
                    >
                        <option value="">Selecione um Usuário</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="bookId">Livro:</label>
                    <select
                        id="bookId"
                        value={bookId}
                        onChange={(e) => setBookId(e.target.value)}
                        required
                        className="form-select"
                    >
                        <option value="">Selecione um Livro</option>
                        {books.map((book) => (
                            <option key={book.id} value={book.id}>
                                {book.title} por {book.author}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="statusName">Status:</label>
                    <input
                        type="text" // Ou um select com opções pré-definidas como "Lido", "Lendo", "Quero Ler"
                        id="statusName"
                        value={statusName}
                        onChange={(e) => setStatusName(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="completionDate">
                        Data de Conclusão (Opcional):
                    </label>
                    <input
                        type="date"
                        id="completionDate"
                        value={completionDate}
                        onChange={(e) => setCompletionDate(e.target.value)}
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="notes">Notas (Opcional):</label>
                    <textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows="4"
                        className="form-textarea"
                    ></textarea>
                </div>

                {/* Exibe mensagem de erro, se houver. */}
                {error && <p className="reading-status-edit-error">{error}</p>}

                <button
                    type="submit"
                    disabled={submitting}
                    className="form-submit-button"
                >
                    {submitting
                        ? "Salvando..."
                        : isEditing
                        ? "Atualizar Status"
                        : "Criar Status"}
                </button>

                {/* Botão para voltar à lista. */}
                <button
                    type="button"
                    onClick={() => navigate("/reading-statuses")}
                    className="form-back-button"
                    disabled={submitting}
                >
                    Voltar
                </button>
            </form>
        </div>
    );
};

// Validação das propriedades (não há props diretas, o ID é obtido via useParams).
ReadingStatusesEdit.propTypes = {
    // Componente obtém o ID via useParams, não diretamente via props.
};

export default ReadingStatusesEdit;
