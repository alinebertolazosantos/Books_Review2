// frontend/src/pages/BookDetailsPage.jsx (Exemplo)
// Assumindo que você tem essa página ou algo similar

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import BookGenresDestroy from "../components/BookGenres/BookGenresDestroy"; // Importe o componente BookGenresDestroy
// import outros componentes se necessário, por exemplo, para adicionar um gênero

// Você pode ter um CSS global ou um CSS específico para esta página aqui
// import '../styles/BookDetailsPage.css'; // Exemplo de importação de CSS para a página

const BookDetailsPage = () => {
    const { bookId } = useParams(); // Pega o ID do livro da URL
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_BASE_URL = "http://localhost:8000/api"; // Sua URL da API

    useEffect(() => {
        fetchBookDetails();
    }, [bookId]);

    const fetchBookDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/books/${bookId}`);
            setBook(response.data);
        } catch (err) {
            console.error("Erro ao buscar detalhes do livro:", err);
            setError("Erro ao carregar detalhes do livro.");
        } finally {
            setLoading(false);
        }
    };

    // Função que será chamada quando um gênero for removido com sucesso
    // Esta função é importante para atualizar o estado da lista de gêneros no React
    const handleGenreRemoved = (removedGenreId) => {
        setBook((prevBook) => {
            if (!prevBook) return null;
            return {
                ...prevBook,
                genres: prevBook.genres.filter(
                    (genre) => genre.id !== removedGenreId
                ),
            };
        });
    };

    if (loading) return <div>Carregando detalhes do livro...</div>;
    if (error) return <div style={{ color: "red" }}>{error}</div>; // Pode usar uma classe CSS aqui
    if (!book) return <div>Livro não encontrado.</div>;

    return (
        <div className="book-details-container">
            {" "}
            {/* Ou outra classe CSS para a página */}
            <h1>{book.title}</h1>
            <p>Autor: {book.author}</p>
            <p>Descrição: {book.description}</p>
            <h2>Gêneros:</h2>
            {book.genres && book.genres.length > 0 ? (
                <ul className="genre-list">
                    {" "}
                    {/* Ou outra classe CSS para a lista */}
                    {book.genres.map((genre) => (
                        <li key={genre.id} className="genre-item">
                            {" "}
                            {/* Ou outra classe CSS para o item da lista */}
                            {genre.name}
                            {/* A "view" BookGenresDestroy.jsx é usada aqui! */}
                            <BookGenresDestroy
                                bookId={book.id}
                                genreId={genre.id}
                                genreName={genre.name}
                                onGenreRemoved={handleGenreRemoved} // Passa a função para atualizar a lista
                            />
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Nenhum gênero associado a este livro.</p>
            )}
            {/* Adicione aqui qualquer outra parte da "view" de detalhes do livro */}
        </div>
    );
};

export default BookDetailsPage;
