// frontend/src/components/Books/BookList.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Para navegar para detalhes/edição/criação
import BookDestroy from "./BookDestroy"; // Importa o componente para exclusão de livro
import "./BookList.css"; // Importa o CSS específico para esta lista

const BookList = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // URL base da API Laravel.
    const API_BASE_URL = "http://localhost:8000/api";

    useEffect(() => {
        // Busca os livros ao montar o componente.
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        setLoading(true);
        setError(null);
        try {
            // Requisição GET para listar todos os livros.
            const response = await axios.get(`${API_BASE_URL}/books`);
            setBooks(response.data);
        } catch (err) {
            console.error(
                "Erro ao buscar livros:",
                err.response?.data || err.message
            );
            setError("Erro ao carregar livros. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const handleBookRemoved = (removedBookId) => {
        // Filtra o livro removido da lista para atualizar a UI.
        setBooks((prevBooks) =>
            prevBooks.filter((book) => book.id !== removedBookId)
        );
    };

    // Exibe estado de carregamento.
    if (loading) {
        return <div className="book-list-loading">Carregando livros...</div>;
    }

    // Exibe mensagem de erro.
    if (error) {
        return <div className="book-list-error">{error}</div>;
    }

    return (
        <div className="book-list-container">
            <h1 className="book-list-title">Meus Livros</h1>

            {/* Link para a página de criação de um novo livro. */}
            <Link to="/books/create" className="book-list-add-button">
                Adicionar Novo Livro
            </Link>

            {books.length === 0 ? (
                <p className="book-list-no-data">
                    Nenhum livro encontrado. Que tal adicionar um?
                </p>
            ) : (
                <ul className="book-list">
                    {books.map((book) => (
                        <li key={book.id} className="book-list-item">
                            <div className="book-item-info">
                                <span className="book-item-title">
                                    {book.title}
                                </span>
                                <span className="book-item-author">
                                    por {book.author}
                                </span>
                            </div>
                            <div className="book-list-actions">
                                {/* Link para os detalhes do livro. */}
                                <Link
                                    to={`/books/${book.id}`}
                                    className="book-list-button details"
                                >
                                    Detalhes
                                </Link>
                                {/* Link para a edição do livro. */}
                                <Link
                                    to={`/books/${book.id}/edit`}
                                    className="book-list-button edit"
                                >
                                    Editar
                                </Link>
                                {/* Componente de exclusão do livro. */}
                                <BookDestroy
                                    bookId={book.id}
                                    bookTitle={book.title}
                                    onBookRemoved={handleBookRemoved}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default BookList;
