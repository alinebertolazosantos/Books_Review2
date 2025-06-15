import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const BookGenresList = () => {
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_BASE_URL = "http://localhost:8000/api";

    useEffect(() => {
        fetchBookGenres();
    }, []);

    const fetchBookGenres = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/genres`);
            console.log("Genres recebidos:", response.data.data); // para depuração
            setGenres(response.data.data || []);
        } catch (err) {
            console.error("Erro ao buscar gêneros:", err);
            setError("Erro ao carregar gêneros.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Carregando gêneros...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div>
            <h2>Lista de Gêneros</h2>
            <Link to="/genres/create">Adicionar Novo Gênero</Link>
            {genres.length === 0 ? (
                <p>Nenhum gênero encontrado.</p>
            ) : (
                <ul>
                    {genres.map((genre) => (
                        <li key={genre.id}>
                            {genre.name}
                            <div>
                                <Link to={`/genres/${genre.id}`}>Detalhes</Link>{" "}
                                |{" "}
                                <Link to={`/genres/${genre.id}/edit`}>
                                    Editar
                                </Link>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default BookGenresList;
