// frontend/src/components/Genres/GenresList.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Para navegar para detalhes/edição/criação
import GenresDestroy from "./GenresDestroy"; // Importa o componente para exclusão de gênero
import "./GenresList.css"; // Importa o CSS específico para esta lista

const GenresList = () => {
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // URL base da API Laravel.
    const API_BASE_URL = "http://localhost:8000/api";

    useEffect(() => {
        // Busca os gêneros ao montar o componente.
        fetchGenres();
    }, []);

    const fetchGenres = async () => {
        setLoading(true);
        setError(null);
        try {
            // Requisição GET para listar todos os gêneros.
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

    // Exibe estado de carregamento.
    if (loading) {
        return <div className="genres-list-loading">Carregando gêneros...</div>;
    }

    // Exibe mensagem de erro.
    if (error) {
        return <div className="genres-list-error">{error}</div>;
    }

    return (
        <div className="genres-list-container">
            <h1 className="genres-list-title">Meus Gêneros</h1>

            {/* Link para a página de criação de um novo gênero. */}
            <Link to="/genres/create" className="genres-list-add-button">
                Adicionar Novo Gênero
            </Link>

            {genres.length === 0 ? (
                <p className="genres-list-no-data">
                    Nenhum gênero encontrado. Que tal adicionar um?
                </p>
            ) : (
                <ul className="genres-list">
                    {genres.map((genre) => (
                        <li key={genre.id} className="genres-list-item">
                            <span className="genres-item-name">
                                {genre.name}
                            </span>
                            <div className="genres-list-actions">
                                {/* Link para os detalhes do gênero. */}
                                <Link
                                    to={`/genres/${genre.id}`}
                                    className="genres-list-button details"
                                >
                                    Detalhes
                                </Link>
                                {/* Link para a edição do gênero. */}
                                <Link
                                    to={`/genres/${genre.id}/edit`}
                                    className="genres-list-button edit"
                                >
                                    Editar
                                </Link>
                                {/* Componente de exclusão do gênero. */}
                                <GenresDestroy
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

export default GenresList;
