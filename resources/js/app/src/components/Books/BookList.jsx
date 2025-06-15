// frontend/src/components/Books/BookList.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import BookDestroy from "./BookDestroy";
import "./BookList.css";

const BookList = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_BASE_URL = "http://localhost:8000/api";

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/books`);
            // Se os livros estiverem dentro de `data`, ajusta aqui:
            const data = Array.isArray(response.data)
                ? response.data
                : response.data.data || [];
            setBooks(data);
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
        setBooks((prevBooks) =>
            prevBooks.filter((book) => book.id !== removedBookId)
        );
    };

    if (loading) {
        return <div className="book-list-loading">Carregando livros...</div>;
    }

    if (error) {
        return <div className="book-list-error">{error}</div>;
    }

    return (
        <div className="book-list-container">
            <h1 className="book-list-title">Meus Livros</h1>

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
                                    {book.titulo ?? "Sem título"}
                                </span>
                                <span className="book-item-author">
                                    por {book.autor ?? "Autor desconhecido"}
                                </span>
                            </div>
                            <div className="book-list-actions">
                                <Link
                                    to={`/books/${book.id}`}
                                    className="book-list-button details"
                                >
                                    Detalhes
                                </Link>
                                <Link
                                    to={`/books/${book.id}/edit`}
                                    className="book-list-button edit"
                                >
                                    Editar
                                </Link>
                                <BookDestroy
                                    bookId={book.id}
                                    bookTitle={book.titulo}
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
