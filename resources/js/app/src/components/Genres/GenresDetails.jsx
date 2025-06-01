// frontend/src/components/Genres/GenresDetails.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom"; // Para pegar o ID da URL, navegar e criar links
import PropTypes from "prop-types"; // Para validação de props
import GenresDestroy from "./GenresDestroy"; // Importa o componente para exclusão do gênero
import "./GenresDetails.css"; // Importa o CSS específico para este componente

const GenresDetails = () => {
    // Pega o 'id' (genreId) da URL.
    const { id: genreId } = useParams();
    const navigate = useNavigate(); // Para navegar após a exclusão ou edição.

    const [genre, setGenre] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // URL base da API Laravel.
    const API_BASE_URL = "http://localhost:8000/api";

    useEffect(() => {
        // Função para buscar os detalhes do gênero.
        const fetchGenreDetails = async () => {
            if (!genreId) {
                setError("ID do gênero não fornecido.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                // Requisição GET para buscar os detalhes do gênero específico.
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

    const handleGenreRemoved = () => {
        // Navega para a lista de gêneros após a remoção bem-sucedida.
        navigate("/genres");
        alert("Gênero removido com sucesso!");
    };

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
            <h1 className="genre-details-title">{genre.name}</h1>
            <div className="genre-details-info">
                <p>
                    <strong>ID:</strong> {genre.id}
                </p>
                <p className="genre-details-description">
                    <strong>Descrição:</strong>{" "}
                    {genre.description || "Sem descrição."}
                </p>

                {/* Exibe livros associados a este gênero, se existirem. */}
                {genre.books && genre.books.length > 0 && (
                    <div className="genre-details-books">
                        <h3>Livros Associados:</h3>
                        <ul className="genre-details-books-list">
                            {genre.books.map((book) => (
                                <li key={book.id}>
                                    <Link to={`/books/${book.id}`}>
                                        {book.title}
                                    </Link>{" "}
                                    por {book.author}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <div className="genre-details-actions">
                {/* Botão para editar o gênero. */}
                <Link
                    to={`/genres/${genre.id}/edit`}
                    className="genre-details-button edit"
                >
                    Editar Gênero
                </Link>
                {/* Componente para exclusão do gênero. */}
                <GenresDestroy
                    genreId={genre.id}
                    genreName={genre.name}
                    onGenreRemoved={handleGenreRemoved}
                />
                {/* Botão para voltar à lista de gêneros. */}
                <button
                    onClick={() => navigate("/genres")}
                    className="genre-details-button back"
                >
                    Voltar para a Lista
                </button>
            </div>
        </div>
    );
};

// Validação das propriedades (genreId é obtido via useParams).
GenresDetails.propTypes = {
    // Componente obtém o ID via useParams, não diretamente via props.
};

export default GenresDetails;
