// frontend/src/components/Users/UserDetails.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom"; // Para pegar o ID da URL, navegar e criar links
import PropTypes from "prop-types"; // Para validação de props
import UserDestroy from "./UserDestroy"; // Importa o componente para exclusão do usuário
import "./UserDetails.css"; // Importa o CSS específico para este componente

const UserDetails = () => {
    // Pega o 'id' (userId) da URL.
    const { id: userId } = useParams();
    const navigate = useNavigate(); // Para navegar após a exclusão ou edição.

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // URL base da API Laravel.
    const API_BASE_URL = "http://localhost:8000/api";

    useEffect(() => {
        // Função para buscar os detalhes do usuário.
        const fetchUserDetails = async () => {
            if (!userId) {
                setError("ID do usuário não fornecido.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                // Requisição GET para buscar os detalhes do usuário específico.
                const response = await axios.get(
                    `${API_BASE_URL}/users/${userId}`
                );
                setUser(response.data);
            } catch (err) {
                console.error(
                    "Erro ao buscar detalhes do usuário:",
                    err.response?.data || err.message
                );
                setError(
                    err.response?.data?.message ||
                        "Erro ao carregar detalhes do usuário."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, [userId]); // Re-executa o efeito se o userId mudar.

    const handleUserRemoved = () => {
        // Navega para a lista de usuários após a remoção bem-sucedida.
        navigate("/users");
        alert("Usuário removido com sucesso!");
    };

    // Exibe estado de carregamento.
    if (loading) {
        return (
            <div className="user-details-loading">
                Carregando detalhes do usuário...
            </div>
        );
    }

    // Exibe mensagem de erro.
    if (error) {
        return <div className="user-details-error">{error}</div>;
    }

    // Exibe mensagem se o usuário não for encontrado.
    if (!user) {
        return (
            <div className="user-details-not-found">
                Usuário não encontrado.
            </div>
        );
    }

    return (
        <div className="user-details-container">
            <h1 className="user-details-title">{user.name}</h1>
            <div className="user-details-info">
                <p>
                    <strong>ID:</strong> {user.id}
                </p>
                <p>
                    <strong>Email:</strong> {user.email}
                </p>
                {/* Exibe data de criação/atualização se disponível na API. */}
                {user.created_at && (
                    <p>
                        <strong>Membro desde:</strong>{" "}
                        {new Date(user.created_at).toLocaleDateString()}
                    </p>
                )}
                {user.updated_at && (
                    <p>
                        <strong>Última atualização:</strong>{" "}
                        {new Date(user.updated_at).toLocaleDateString()}
                    </p>
                )}

                {/* Exibe avaliações feitas pelo usuário, se existirem. */}
                {user.reviews && user.reviews.length > 0 && (
                    <div className="user-details-reviews">
                        <h3>Avaliações Feitas:</h3>
                        <ul className="user-details-reviews-list">
                            {user.reviews.map((review) => (
                                <li key={review.id}>
                                    <Link to={`/reviews/${review.id}`}>
                                        "{review.comment}"
                                    </Link>{" "}
                                    ({review.rating} estrelas em{" "}
                                    {review.book
                                        ? review.book.title
                                        : "Livro Desconhecido"}
                                    )
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Exibe status de leitura do usuário, se existirem. */}
                {user.reading_statuses && user.reading_statuses.length > 0 && (
                    <div className="user-details-reading-statuses">
                        <h3>Status de Leitura:</h3>
                        <ul className="user-details-reading-statuses-list">
                            {user.reading_statuses.map((status) => (
                                <li key={status.id}>
                                    <Link to={`/reading-statuses/${status.id}`}>
                                        "{status.status_name}"
                                    </Link>{" "}
                                    em{" "}
                                    {status.book
                                        ? status.book.title
                                        : "Livro Desconhecido"}
                                    {status.completion_date &&
                                        ` (Concluído em: ${new Date(
                                            status.completion_date
                                        ).toLocaleDateString()})`}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <div className="user-details-actions">
                {/* Botão para editar o usuário. */}
                <Link
                    to={`/users/${user.id}/edit`}
                    className="user-details-button edit"
                >
                    Editar Usuário
                </Link>
                {/* Componente para exclusão do usuário. */}
                <UserDestroy
                    userId={user.id}
                    userName={user.name}
                    onUserRemoved={handleUserRemoved}
                />
                {/* Botão para voltar à lista de usuários. */}
                <button
                    onClick={() => navigate("/users")}
                    className="user-details-button back"
                >
                    Voltar para a Lista
                </button>
            </div>
        </div>
    );
};

// Validação das propriedades (userId é obtido via useParams).
UserDetails.propTypes = {
    // Componente obtém o ID via useParams, não diretamente via props.
};

export default UserDetails;
