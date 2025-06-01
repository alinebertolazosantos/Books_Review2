// frontend/src/components/Books/BookDetails.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom"; // Para pegar o ID da URL, navegar e criar links
import PropTypes from "prop-types";
import BookDestroy from "./BookDestroy"; // Importa o componente para exclusão do livro
import "./BookDetails.css"; // Importa o CSS específico para este componente

const BookDetails = () => {
    // Pega o 'id' (bookId) da URL.
    const { id: bookId } = useParams();
    const navigate = useNavigate(); // Para navegar após a exclusão ou edição.

    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // URL base da API Laravel.
    const API_BASE_URL = "http://localhost:8000/api";

    useEffect(() => {
        // Função para buscar os detalhes do livro.
        const fetchBookDetails = async () => {
            if (!bookId) {
                setError("ID do livro não fornecido.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                // Requisição GET para buscar os detalhes do livro específico.
                const response = await axios.get(
                    `${API_BASE_URL}/books/${bookId}`
                );
                setBook(response.data);
            } catch (err) {
                console.error(
                    "Erro ao buscar detalhes do livro:",
                    err.response?.data || err.message
                );
                setError(
                    err.response?.data?.message ||
                        "Erro ao carregar detalhes do livro."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchBookDetails();
    }, [bookId]); // Re-executa o efeito se o bookId mudar.

    const handleBookRemoved = () => {
        // Navega para a lista de livros após a remoção bem-sucedida.
        navigate("/books");
        alert("Livro removido com sucesso!");
    };

    // Exibe estado de carregamento.
    if (loading) {
        return (
            <div className="book-details-loading">
                Carregando detalhes do livro...
            </div>
        );
    }

    // Exibe mensagem de erro.
    if (error) {
        return <div className="book-details-error">{error}</div>;
    }

    // Exibe mensagem se o livro não for encontrado.
    if (!book) {
        return (
            <div className="book-details-not-found">Livro não encontrado.</div>
        );
    }

    return (
        <div className="book-details-container">
            <h1 className="book-details-title">{book.title}</h1>
            <div className="book-details-info">
                <p>
                    <strong>Autor:</strong> {book.author}
                </p>
                <p>
                    <strong>Editora:</strong>{" "}
                    {book.publisher ? book.publisher.name : "N/A"}
                </p>{" "}
                {/* Exemplo com editora */}
                <p>
                    <strong>Ano de Publicação:</strong>{" "}
                    {book.publication_year || "N/A"}
                </p>
                <p className="book-details-description">
                    <strong>Descrição:</strong>{" "}
                    {book.description || "Sem descrição."}
                </p>
                {/* Exibe gêneros associados, se existirem. */}
                {book.genres && book.genres.length > 0 && (
                    <div className="book-details-genres">
                        <h3>Gêneros:</h3>
                        <ul className="book-details-genres-list">
                            {book.genres.map((genre) => (
                                <li key={genre.id}>{genre.name}</li>
                            ))}
                        </ul>
                    </div>
                )}
                {/* Exibe status de leitura, se existirem (ex: para o usuário logado). */}
                {book.reading_statuses && book.reading_statuses.length > 0 && (
                    <div className="book-details-reading-statuses">
                        <h3>Status de Leitura:</h3>
                        <ul className="book-details-reading-statuses-list">
                            {book.reading_statuses.map((status) => (
                                <li key={status.id}>
                                    {status.user
                                        ? status.user.name
                                        : "Usuário Desconhecido"}
                                    : {status.status_name}
                                    {status.completion_date &&
                                        ` (Concluído em: ${new Date(
                                            status.completion_date
                                        ).toLocaleDateString()})`}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {/* Exibe avaliações, se existirem. */}
                {book.reviews && book.reviews.length > 0 && (
                    <div className="book-details-reviews">
                        <h3>Avaliações:</h3>
                        <ul className="book-details-reviews-list">
                            {book.reviews.map((review) => (
                                <li key={review.id}>
                                    <strong>
                                        {review.user
                                            ? review.user.name
                                            : "Usuário Desconhecido"}
                                        :
                                    </strong>{" "}
                                    {review.rating} estrelas - "{review.comment}
                                    "
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <div className="book-details-actions">
                {/* Botão para editar o livro. */}
                <Link
                    to={`/books/${book.id}/edit`}
                    className="book-details-button edit"
                >
                    Editar Livro
                </Link>
                {/* Componente para exclusão do livro. */}
                <BookDestroy
                    bookId={book.id}
                    bookTitle={book.title}
                    onBookRemoved={handleBookRemoved}
                />
                {/* Botão para voltar à lista de livros. */}
                <button
                    onClick={() => navigate("/books")}
                    className="book-details-button back"
                >
                    Voltar para a Lista
                </button>
            </div>
        </div>
    );
};

// Validação da propriedade 'bookId' (obtida de useParams).
BookDetails.propTypes = {
    // Não há props diretas, o ID é obtido via useParams.
};

export default BookDetails;
