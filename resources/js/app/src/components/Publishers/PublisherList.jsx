// frontend/src/components/Publishers/PublisherList.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Para navegar para detalhes/edição/criação
import PublisherDestroy from "./PublisherDestroy"; // Importa o componente para exclusão de editora
import "./PublisherList.css"; // Importa o CSS específico para esta lista

const PublisherList = () => {
    const [publishers, setPublishers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // URL base da API Laravel.
    const API_BASE_URL = "http://localhost:8000/api";

    useEffect(() => {
        // Busca as editoras ao montar o componente.
        fetchPublishers();
    }, []);

    const fetchPublishers = async () => {
        setLoading(true);
        setError(null);
        try {
            // Requisição GET para listar todas as editoras.
            const response = await axios.get(`${API_BASE_URL}/publishers`);
            setPublishers(response.data);
        } catch (err) {
            console.error(
                "Erro ao buscar editoras:",
                err.response?.data || err.message
            );
            setError("Erro ao carregar editoras. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const handlePublisherRemoved = (removedPublisherId) => {
        // Filtra a editora removida da lista para atualizar a UI.
        setPublishers((prevPublishers) =>
            prevPublishers.filter(
                (publisher) => publisher.id !== removedPublisherId
            )
        );
    };

    // Exibe estado de carregamento.
    if (loading) {
        return (
            <div className="publisher-list-loading">Carregando editoras...</div>
        );
    }

    // Exibe mensagem de erro.
    if (error) {
        return <div className="publisher-list-error">{error}</div>;
    }

    return (
        <div className="publisher-list-container">
            <h1 className="publisher-list-title">Minhas Editoras</h1>

            {/* Link para a página de criação de uma nova editora. */}
            <Link to="/publishers/create" className="publisher-list-add-button">
                Adicionar Nova Editora
            </Link>

            {publishers.length === 0 ? (
                <p className="publisher-list-no-data">
                    Nenhuma editora encontrada. Que tal adicionar uma?
                </p>
            ) : (
                <ul className="publisher-list">
                    {publishers.map((publisher) => (
                        <li key={publisher.id} className="publisher-list-item">
                            <span className="publisher-item-name">
                                {publisher.name}
                            </span>
                            <div className="publisher-list-actions">
                                {/* Link para os detalhes da editora. */}
                                <Link
                                    to={`/publishers/${publisher.id}`}
                                    className="publisher-list-button details"
                                >
                                    Detalhes
                                </Link>
                                {/* Link para a edição da editora. */}
                                <Link
                                    to={`/publishers/${publisher.id}/edit`}
                                    className="publisher-list-button edit"
                                >
                                    Editar
                                </Link>
                                {/* Componente de exclusão da editora. */}
                                <PublisherDestroy
                                    publisherId={publisher.id}
                                    publisherName={publisher.name}
                                    onPublisherRemoved={handlePublisherRemoved}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PublisherList;
