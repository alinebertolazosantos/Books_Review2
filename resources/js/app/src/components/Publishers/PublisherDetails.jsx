// frontend/src/components/Publishers/PublisherDetails.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom"; // Para pegar o ID da URL, navegar e criar links
import PropTypes from "prop-types"; // Para validação de props
import PublisherDestroy from "./PublisherDestroy"; // Importa o componente para exclusão da editora
import "./PublisherDetails.css"; // Importa o CSS específico para este componente

const PublisherDetails = () => {
    // Pega o 'id' (publisherId) da URL.
    const { id: publisherId } = useParams();
    const navigate = useNavigate(); // Para navegar após a exclusão ou edição.

    const [publisher, setPublisher] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // URL base da API Laravel.
    const API_BASE_URL = "http://localhost:8000/api";

    useEffect(() => {
        // Função para buscar os detalhes da editora.
        const fetchPublisherDetails = async () => {
            if (!publisherId) {
                setError("ID da editora não fornecido.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                // Requisição GET para buscar os detalhes da editora específica.
                const response = await axios.get(
                    `${API_BASE_URL}/publishers/${publisherId}`
                );
                setPublisher(response.data);
            } catch (err) {
                console.error(
                    "Erro ao buscar detalhes da editora:",
                    err.response?.data || err.message
                );
                setError(
                    err.response?.data?.message ||
                        "Erro ao carregar detalhes da editora."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchPublisherDetails();
    }, [publisherId]); // Re-executa o efeito se o publisherId mudar.

    const handlePublisherRemoved = () => {
        // Navega para a lista de editoras após a remoção bem-sucedida.
        navigate("/publishers");
        alert("Editora removida com sucesso!");
    };

    // Exibe estado de carregamento.
    if (loading) {
        return (
            <div className="publisher-details-loading">
                Carregando detalhes da editora...
            </div>
        );
    }

    // Exibe mensagem de erro.
    if (error) {
        return <div className="publisher-details-error">{error}</div>;
    }

    // Exibe mensagem se a editora não for encontrada.
    if (!publisher) {
        return (
            <div className="publisher-details-not-found">
                Editora não encontrada.
            </div>
        );
    }

    return (
        <div className="publisher-details-container">
            <h1 className="publisher-details-title">{publisher.name}</h1>
            <div className="publisher-details-info">
                <p>
                    <strong>ID:</strong> {publisher.id}
                </p>
                <p>
                    <strong>Endereço:</strong>{" "}
                    {publisher.address || "Não informado."}
                </p>{" "}
                {/* Exemplo de campo de endereço */}
                <p>
                    <strong>Telefone:</strong>{" "}
                    {publisher.phone || "Não informado."}
                </p>{" "}
                {/* Exemplo de campo de telefone */}
                <p>
                    <strong>Email:</strong>{" "}
                    {publisher.email || "Não informado."}
                </p>{" "}
                {/* Exemplo de campo de email */}
                {/* Exibe livros publicados por esta editora, se existirem. */}
                {publisher.books && publisher.books.length > 0 && (
                    <div className="publisher-details-books">
                        <h3>Livros Publicados:</h3>
                        <ul className="publisher-details-books-list">
                            {publisher.books.map((book) => (
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

            <div className="publisher-details-actions">
                {/* Botão para editar a editora. */}
                <Link
                    to={`/publishers/${publisher.id}/edit`}
                    className="publisher-details-button edit"
                >
                    Editar Editora
                </Link>
                {/* Componente para exclusão da editora. */}
                <PublisherDestroy
                    publisherId={publisher.id}
                    publisherName={publisher.name}
                    onPublisherRemoved={handlePublisherRemoved}
                />
                {/* Botão para voltar à lista de editoras. */}
                <button
                    onClick={() => navigate("/publishers")}
                    className="publisher-details-button back"
                >
                    Voltar para a Lista
                </button>
            </div>
        </div>
    );
};

// Validação das propriedades (publisherId é obtido via useParams).
PublisherDetails.propTypes = {
    // Componente obtém o ID via useParams, não diretamente via props.
};

export default PublisherDetails;
