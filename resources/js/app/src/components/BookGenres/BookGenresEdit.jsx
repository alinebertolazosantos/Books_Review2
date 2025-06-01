// frontend/src/components/BookGenres/BookGenresEdit.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // Para pegar o ID da URL e navegar
import PropTypes from "prop-types";
import "../BookGenresEdit.css"; // Importa o CSS específico para este componente

const BookGenresEdit = () => {
    // Pega o 'id' (genreId) da URL, se existir.
    const { id: genreId } = useParams();
    const navigate = useNavigate(); // Para navegar após a operação.

    const [genreName, setGenreName] = useState("");
    const [genreDescription, setGenreDescription] = useState(""); // Se o gênero tiver descrição
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false); // Para controlar o estado de envio do formulário
    const [error, setError] = useState(null);

    // Determina se estamos editando ou criando.
    const isEditing = Boolean(genreId);

    // URL base da API Laravel.
    const API_BASE_URL = "http://localhost:8000/api";

    useEffect(() => {
        // Se estiver editando, busca os detalhes do gênero existente.
        const fetchGenre = async () => {
            if (!isEditing) {
                setLoading(false); // Se não estiver editando, não precisa carregar dados existentes.
                return;
            }

            setLoading(true);
            setError(null);
            try {
                // Requisição GET para buscar os detalhes do gênero a ser editado.
                const response = await axios.get(
                    `${API_BASE_URL}/genres/${genreId}`
                );
                const genreData = response.data;
                setGenreName(genreData.name || "");
                setGenreDescription(genreData.description || ""); // Preenche a descrição se existir
            } catch (err) {
                console.error(
                    "Erro ao buscar gênero para edição:",
                    err.response?.data || err.message
                );
                setError("Erro ao carregar dados do gênero. Tente novamente.");
            } finally {
                setLoading(false);
            }
        };

        fetchGenre();
    }, [genreId, isEditing]); // Re-executa se o ID ou o modo de edição mudar.

    const handleSubmit = async (e) => {
        e.preventDefault(); // Previne o comportamento padrão de recarregar a página.

        setSubmitting(true);
        setError(null);

        try {
            const genreData = {
                name: genreName,
                description: genreDescription,
                // Adicione outros campos do gênero aqui, se houver.
            };

            if (isEditing) {
                // Requisição PUT/PATCH para atualizar um gênero existente.
                await axios.put(`${API_BASE_URL}/genres/${genreId}`, genreData);
                alert("Gênero atualizado com sucesso!");
            } else {
                // Requisição POST para criar um novo gênero.
                await axios.post(`${API_BASE_URL}/genres`, genreData);
                alert("Gênero criado com sucesso!");
            }
            navigate("/genres"); // Navega de volta para a lista de gêneros após sucesso.
        } catch (err) {
            console.error(
                "Erro ao salvar gênero:",
                err.response?.data || err.message
            );
            setError(
                err.response?.data?.message ||
                    "Erro ao salvar gênero. Verifique os dados."
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="book-genres-edit-loading">
                Carregando formulário...
            </div>
        );
    }

    return (
        <div className="book-genres-edit-container">
            <h1 className="book-genres-edit-title">
                {isEditing ? "Editar Gênero" : "Criar Novo Gênero"}
            </h1>

            <form onSubmit={handleSubmit} className="book-genres-edit-form">
                <div className="form-group">
                    <label htmlFor="genreName">Nome do Gênero:</label>
                    <input
                        type="text"
                        id="genreName"
                        value={genreName}
                        onChange={(e) => setGenreName(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="genreDescription">
                        Descrição (Opcional):
                    </label>
                    <textarea
                        id="genreDescription"
                        value={genreDescription}
                        onChange={(e) => setGenreDescription(e.target.value)}
                        rows="4"
                        className="form-textarea"
                    ></textarea>
                </div>

                {/* Exibe mensagem de erro, se houver. */}
                {error && <p className="book-genres-edit-error">{error}</p>}

                <button
                    type="submit"
                    disabled={submitting}
                    className="form-submit-button"
                >
                    {submitting
                        ? "Salvando..."
                        : isEditing
                        ? "Atualizar Gênero"
                        : "Criar Gênero"}
                </button>

                {/* Botão para voltar à lista. */}
                <button
                    type="button"
                    onClick={() => navigate("/genres")}
                    className="form-back-button"
                    disabled={submitting}
                >
                    Voltar
                </button>
            </form>
        </div>
    );
};

// PropTypes para documentar as props (mesmo que não haja props diretas no momento,
// o componente usa `useParams` para o ID, mas se fosse receber props, seria aqui).
BookGenresEdit.propTypes = {
    // Não há props diretas, o ID é obtido via useParams.
};

export default BookGenresEdit;
