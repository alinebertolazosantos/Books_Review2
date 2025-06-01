// frontend/src/components/BookGenres/BookGenresDetails.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import "../BookGenresDetails.css"; // Importa o CSS específico

const BookGenresDetails = ({ genreId }) => {
    const [genre, setGenre] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // URL base da API Laravel.
    const API_BASE_URL = "http://localhost:8000/api";

    useEffect(() => {
        const fetchGenreDetails = async () => {
            // Verifica se o ID do gênero foi fornecido.
            if (!genreId) {
                setError("ID do gênero não fornecido.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                // Requisição GET para buscar detalhes do gênero.
                const response = await axios.get(
                    `${API_BASE_URL}/genres/${genreId}`
                );
                setGenre(response.data);
            } catch (err) {
                console.error(
                    "Erro ao buscar detalhes do gênero:",
                    err.response?.data || err.message
                );
                setError(
                    err.response?.data?.message ||
                        "Erro ao carregar detalhes do gênero."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchGenreDetails();
    }, [genreId]); // Re-executa o efeito se o genreId mudar.

    // Exibe estado de carregamento.
    if (loading) {
        return (
            <div className="genre-details-loading">
                Carregando detalhes do gênero...
            </div>
        );
    }

    // Exibe mensagem de erro.
    if (error) {
        return <div className="genre-details-error">{error}</div>;
    }

    // Exibe mensagem se o gênero não for encontrado.
    if (!genre) {
        return (
            <div className="genre-details-not-found">
                Gênero não encontrado.
            </div>
        );
    }

    return (
        <div className="genre-details-container">
            <h2 className="genre-details-title">Detalhes do Gênero</h2>
            <div className="genre-details-info">
                <p>
                    <strong>ID:</strong> {genre.id}
                </p>
                <p>
                    <strong>Nome:</strong> {genre.name}
                </p>
                {/* Exibe descrição se existir. */}
                {genre.description && (
                    <p>
                        <strong>Descrição:</strong> {genre.description}
                    </p>
                )}
                {/* Exibe livros associados se existirem. */}
                {genre.books && genre.books.length > 0 && (
                    <div className="genre-details-books">
                        <h3>Livros Associados:</h3>
                        <ul className="genre-details-books-list">
                            {genre.books.map((book) => (
                                <li key={book.id}>
                                    {book.title} ({book.author})
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            {/* Espaço para botões de edição ou exclusão, se necessário. */}
        </div>
    );
};

// Validação da propriedade 'genreId'.
BookGenresDetails.propTypes = {
    genreId: PropTypes.number.isRequired,
};

export default BookGenresDetails;
