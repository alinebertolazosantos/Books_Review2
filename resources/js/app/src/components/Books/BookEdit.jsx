// frontend/src/components/Books/BookEdit.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // Para pegar o ID da URL e navegar
import PropTypes from "prop-types"; // Para validação de props
import "./BookEdit.css"; // Importa o CSS específico para este componente

const BookEdit = () => {
    // Pega o 'id' (bookId) da URL, se existir.
    const { id: bookId } = useParams();
    const navigate = useNavigate(); // Para navegar após a operação.

    // Estados para os campos do formulário do livro.
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [publicationYear, setPublicationYear] = useState("");
    const [description, setDescription] = useState("");
    const [publisherId, setPublisherId] = useState(""); // Para a editora (se houver seleção)
    const [publishers, setPublishers] = useState([]); // Lista de editoras para um select

    const [loading, setLoading] = useState(true); // Controla o carregamento inicial (para edição)
    const [submitting, setSubmitting] = useState(false); // Controla o estado de envio do formulário
    const [error, setError] = useState(null); // Para mensagens de erro

    // Determina se estamos editando ou criando.
    const isEditing = Boolean(bookId);

    // URL base da API Laravel.
    const API_BASE_URL = "http://localhost:8000/api";

    useEffect(() => {
        // Função para buscar editoras (se houver um campo de seleção de editora).
        const fetchPublishers = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/publishers`);
                setPublishers(response.data);
            } catch (err) {
                console.error(
                    "Erro ao carregar editoras:",
                    err.response?.data || err.message
                );
                setError("Erro ao carregar lista de editoras.");
            }
        };

        // Se estiver editando, busca os detalhes do livro existente.
        const fetchBook = async () => {
            if (!isEditing) {
                setLoading(false); // Se não estiver editando, não precisa carregar dados existentes.
                return;
            }

            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/books/${bookId}`
                );
                const bookData = response.data;
                setTitle(bookData.title || "");
                setAuthor(bookData.author || "");
                setPublicationYear(bookData.publication_year || "");
                setDescription(bookData.description || "");
                setPublisherId(bookData.publisher_id || ""); // Define o ID da editora, se existir.
            } catch (err) {
                console.error(
                    "Erro ao buscar livro para edição:",
                    err.response?.data || err.message
                );
                setError("Erro ao carregar dados do livro. Tente novamente.");
            } finally {
                setLoading(false);
            }
        };

        fetchPublishers(); // Sempre tenta carregar as editoras.
        fetchBook(); // Busca os dados do livro apenas se estiver editando.
    }, [bookId, isEditing]); // Re-executa se o ID ou o modo de edição mudar.

    const handleSubmit = async (e) => {
        e.preventDefault(); // Previne o comportamento padrão de recarregar a página.

        setSubmitting(true);
        setError(null); // Limpa erros anteriores.

        try {
            const bookData = {
                title,
                author,
                publication_year: publicationYear,
                description,
                publisher_id: publisherId || null, // Garante que publisher_id seja null se vazio
            };

            if (isEditing) {
                // Requisição PUT/PATCH para atualizar um livro existente.
                await axios.put(`${API_BASE_URL}/books/${bookId}`, bookData);
                alert("Livro atualizado com sucesso!");
            } else {
                // Requisição POST para criar um novo livro.
                await axios.post(`${API_BASE_URL}/books`, bookData);
                alert("Livro criado com sucesso!");
            }
            navigate("/books"); // Navega de volta para a lista de livros após sucesso.
        } catch (err) {
            console.error(
                "Erro ao salvar livro:",
                err.response?.data || err.message
            );
            setError(
                err.response?.data?.message ||
                    "Erro ao salvar livro. Verifique os dados."
            );
        } finally {
            setSubmitting(false);
        }
    };

    // Exibe estado de carregamento.
    if (loading) {
        return (
            <div className="book-edit-loading">Carregando formulário...</div>
        );
    }

    return (
        <div className="book-edit-container">
            <h1 className="book-edit-title">
                {isEditing ? "Editar Livro" : "Criar Novo Livro"}
            </h1>

            <form onSubmit={handleSubmit} className="book-edit-form">
                <div className="form-group">
                    <label htmlFor="title">Título:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="author">Autor:</label>
                    <input
                        type="text"
                        id="author"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="publicationYear">Ano de Publicação:</label>
                    <input
                        type="number"
                        id="publicationYear"
                        value={publicationYear}
                        onChange={(e) => setPublicationYear(e.target.value)}
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Descrição:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="6"
                        className="form-textarea"
                    ></textarea>
                </div>

                {/* Campo para seleção de Editora (se aplicável ao seu modelo). */}
                <div className="form-group">
                    <label htmlFor="publisher">Editora:</label>
                    <select
                        id="publisher"
                        value={publisherId}
                        onChange={(e) => setPublisherId(e.target.value)}
                        className="form-select"
                    >
                        <option value="">Selecione uma Editora</option>
                        {publishers.map((publisher) => (
                            <option key={publisher.id} value={publisher.id}>
                                {publisher.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Exibe mensagem de erro, se houver. */}
                {error && <p className="book-edit-error">{error}</p>}

                <button
                    type="submit"
                    disabled={submitting}
                    className="form-submit-button"
                >
                    {submitting
                        ? "Salvando..."
                        : isEditing
                        ? "Atualizar Livro"
                        : "Criar Livro"}
                </button>

                {/* Botão para voltar à lista. */}
                <button
                    type="button"
                    onClick={() => navigate("/books")}
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
BookEdit.propTypes = {
    // Componente obtém o ID via useParams, não diretamente via props.
};

export default BookEdit;
