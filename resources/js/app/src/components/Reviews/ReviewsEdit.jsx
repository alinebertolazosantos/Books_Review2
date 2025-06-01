// frontend/src/components/Reviews/ReviewsEdit.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // Para pegar o ID da URL e navegar
import PropTypes from "prop-types"; // Para validação de props
import "./ReviewsEdit.css"; // Importa o CSS específico para este componente

const ReviewsEdit = () => {
    // Pega o 'id' (reviewId) da URL, se existir.
    const { id: reviewId } = useParams();
    const navigate = useNavigate(); // Para navegar após a operação.

    // Estados para os campos do formulário da avaliação.
    const [userId, setUserId] = useState("");
    const [bookId, setBookId] = useState("");
    const [rating, setRating] = useState(""); // Ex: 1 a 5 estrelas
    const [comment, setComment] = useState("");

    const [users, setUsers] = useState([]); // Lista de usuários para um select
    const [books, setBooks] = useState([]); // Lista de livros para um select

    const [loading, setLoading] = useState(true); // Controla o carregamento inicial (para edição)
    const [submitting, setSubmitting] = useState(false); // Controla o estado de envio do formulário
    const [error, setError] = useState(null); // Para mensagens de erro

    // Determina se estamos editando ou criando.
    const isEditing = Boolean(reviewId);

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

        // Se estiver editando, busca os detalhes da avaliação existente.
        const fetchReview = async () => {
            if (!isEditing) {
                setLoading(false); // Se não estiver editando, não precisa carregar dados existentes.
                return;
            }

            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/reviews/${reviewId}`
                );
                const reviewData = response.data;
                setUserId(reviewData.user_id || "");
                setBookId(reviewData.book_id || "");
                setRating(reviewData.rating || "");
                setComment(reviewData.comment || "");
            } catch (err) {
                console.error(
                    "Erro ao buscar avaliação para edição:",
                    err.response?.data || err.message
                );
                setError(
                    "Erro ao carregar dados da avaliação. Tente novamente."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDataForSelects(); // Carrega dados para os selects.
        fetchReview(); // Busca dados da avaliação apenas se estiver editando.
    }, [reviewId, isEditing]); // Re-executa se o ID ou o modo de edição mudar.

    const handleSubmit = async (e) => {
        e.preventDefault(); // Previne o comportamento padrão de recarregar a página.

        setSubmitting(true);
        setError(null); // Limpa erros anteriores.

        try {
            const reviewData = {
                user_id: userId,
                book_id: bookId,
                rating: rating,
                comment: comment || null, // Garante null se vazio
                // Adicione outros campos, se houver.
            };

            if (isEditing) {
                // Requisição PUT/PATCH para atualizar uma avaliação existente.
                await axios.put(
                    `${API_BASE_URL}/reviews/${reviewId}`,
                    reviewData
                );
                alert("Avaliação atualizada com sucesso!");
            } else {
                // Requisição POST para criar uma nova avaliação.
                await axios.post(`${API_BASE_URL}/reviews`, reviewData);
                alert("Avaliação criada com sucesso!");
            }
            navigate("/reviews"); // Navega de volta para a lista após sucesso.
        } catch (err) {
            console.error(
                "Erro ao salvar avaliação:",
                err.response?.data || err.message
            );
            setError(
                err.response?.data?.message ||
                    "Erro ao salvar avaliação. Verifique os dados."
            );
        } finally {
            setSubmitting(false);
        }
    };

    // Exibe estado de carregamento.
    if (loading) {
        return (
            <div className="review-edit-loading">Carregando formulário...</div>
        );
    }

    return (
        <div className="review-edit-container">
            <h1 className="review-edit-title">
                {isEditing ? "Editar Avaliação" : "Criar Nova Avaliação"}
            </h1>

            <form onSubmit={handleSubmit} className="review-edit-form">
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
                    <label htmlFor="rating">
                        Classificação (1-5 estrelas):
                    </label>
                    <input
                        type="number"
                        id="rating"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        required
                        min="1"
                        max="5"
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="comment">Comentário (Opcional):</label>
                    <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows="4"
                        className="form-textarea"
                    ></textarea>
                </div>

                {/* Exibe mensagem de erro, se houver. */}
                {error && <p className="review-edit-error">{error}</p>}

                <button
                    type="submit"
                    disabled={submitting}
                    className="form-submit-button"
                >
                    {submitting
                        ? "Salvando..."
                        : isEditing
                        ? "Atualizar Avaliação"
                        : "Criar Avaliação"}
                </button>

                {/* Botão para voltar à lista. */}
                <button
                    type="button"
                    onClick={() => navigate("/reviews")}
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
ReviewsEdit.propTypes = {
    // Componente obtém o ID via useParams, não diretamente via props.
};

export default ReviewsEdit;
