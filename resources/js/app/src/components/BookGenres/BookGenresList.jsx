// frontend/src/components/BookGenres/BookGenresList.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import BookGenresDestroy from "./BookGenresDestroy";
import "../BookGenresList.css"; // Importa o CSS específico para esta lista

const BookGenresList = () => {
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // URL base da API Laravel.
    const API_BASE_URL = "http://localhost:8000/api";

    useEffect(() => {
        // Busca os gêneros ao montar o componente.
        fetchBookGenres();
    }, []);

    const fetchBookGenres = async () => {
        setLoading(true);
        setError(null);
        try {
            // Requisição GET para listar os gêneros.
            const response = await axios.get(`${API_BASE_URL}/genres`);
            setGenres(response.data);
        } catch (err) {
            console.error(
                "Erro ao buscar gêneros:",
                err.response?.data || err.message
            );
            setError("Erro ao carregar gêneros. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const handleGenreRemoved = (removedGenreId) => {
        // Filtra o gênero removido da lista para atualizar a UI.
        setGenres((prevGenres) =>
            prevGenres.filter((genre) => genre.id !== removedGenreId)
        );
    };

    if (loading) {
        return (
            <div className="book-genres-list-loading">
                Carregando gêneros...
            </div>
        );
    }
    if (error) {
        return <div className="book-genres-list-error">{error}</div>;
    }

    return (
        <div className="book-genres-list-container">
            <h1 className="book-genres-list-title">Meus Gêneros</h1>

            {/* Link para a página de criação de um novo gênero. */}
            <Link to="/genres/create" className="book-genres-list-add-button">
                Adicionar Novo Gênero
            </Link>

            {genres.length === 0 ? (
                <p className="book-genres-no-data">Nenhum gênero encontrado.</p>
            ) : (
                <ul className="book-genres-list">
                    {genres.map((genre) => (
                        <li key={genre.id} className="book-genres-list-item">
                            <span className="book-genres-list-item-name">
                                {genre.name}
                            </span>
                            <div className="book-genres-list-actions">
                                {/* Link para os detalhes do gênero. */}
                                <Link
                                    to={`/genres/${genre.id}`}
                                    className="book-genres-list-button details"
                                >
                                    Ver Detalhes
                                </Link>
                                {/* Link para a edição do gênero. */}
                                <Link
                                    to={`/genres/${genre.id}/edit`}
                                    className="book-genres-list-button edit"
                                >
                                    Editar
                                </Link>
                                {/* Componente de exclusão do gênero. */}
                                <BookGenresDestroy
                                    bookId={null} // Ajuste conforme a lógica da associação livro-gênero.
                                    genreId={genre.id}
                                    genreName={genre.name}
                                    onGenreRemoved={handleGenreRemoved}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default BookGenresList;
