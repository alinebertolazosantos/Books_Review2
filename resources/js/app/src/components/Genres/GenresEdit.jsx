// frontend/src/components/Genres/GenresEdit.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // Para pegar o ID da URL e navegar
import PropTypes from "prop-types"; // Para validação de props
import "./GenresEdit.css"; // Importa o CSS específico para este componente

const GenresEdit = () => {
    // Pega o 'id' (genreId) da URL, se existir.
    const { id: genreId } = useParams();
    const navigate = useNavigate(); // Para navegar após a operação.

    // Estados para os campos do formulário do gênero.
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const [loading, setLoading] = useState(true); // Controla o carregamento inicial (para edição)
    const [submitting, setSubmitting] = useState(false); // Controla o estado de envio do formulário
    const [error, setError] = useState(null); // Para mensagens de erro

    // Determina se estamos editando ou criando.
    const isEditing = Boolean(genreId);

    // URL base da API Laravel.
    const API_BASE_URL = "http://localhost:8000/api";

    useEffect(() => {
        // Se estiver editando, busca os detalhes do gênero existente.
        const fetchGenre = async () => {
            if (!isEditing) {
                setLoading(false); // Se não estiver editando, não precisa carregar dados existentes.
                return;
            }

            setLoading(true);
            setError(null);
            try {
                // Requisição GET para buscar os detalhes do gênero a ser editado.
                const response = await axios.get(
                    `${API_BASE_URL}/genres/${genreId}`
                );
                const genreData = response.data;
                setName(genreData.name || "");
                setDescription(genreData.description || "");
            } catch (err) {
                console.error(
                    "Erro ao buscar gênero para edição:",
                    err.response?.data || err.message
                );
                setError("Erro ao carregar dados do gênero. Tente novamente.");
            } finally {
                setLoading(false);
            }
        };

        fetchGenre(); // Busca os dados do gênero apenas se estiver editando.
    }, [genreId, isEditing]); // Re-executa se o ID ou o modo de edição mudar.

    const handleSubmit = async (e) => {
        e.preventDefault(); // Previne o comportamento padrão de recarregar a página.

        setSubmitting(true);
        setError(null); // Limpa erros anteriores.

        try {
            const genreData = {
                name,
                description,
                // Adicione outros campos do gênero aqui, se houver.
            };

            if (isEditing) {
                // Requisição PUT/PATCH para atualizar um gênero existente.
                await axios.put(`${API_BASE_URL}/genres/${genreId}`, genreData);
                alert("Gênero atualizado com sucesso!");
            } else {
                // Requisição POST para criar um novo gênero.
                await axios.post(`${API_BASE_URL}/genres`, genreData);
                alert("Gênero criado com sucesso!");
            }
            navigate("/genres"); // Navega de volta para a lista de gêneros após sucesso.
        } catch (err) {
            console.error(
                "Erro ao salvar gênero:",
                err.response?.data || err.message
            );
            setError(
                err.response?.data?.message ||
                    "Erro ao salvar gênero. Verifique os dados."
            );
        } finally {
            setSubmitting(false);
        }
    };

    // Exibe estado de carregamento.
    if (loading) {
        return (
            <div className="genre-edit-loading">Carregando formulário...</div>
        );
    }

    return (
        <div className="genre-edit-container">
            <h1 className="genre-edit-title">
                {isEditing ? "Editar Gênero" : "Criar Novo Gênero"}
            </h1>

            <form onSubmit={handleSubmit} className="genre-edit-form">
                <div className="form-group">
                    <label htmlFor="name">Nome do Gênero:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Descrição (Opcional):</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="4"
                        className="form-textarea"
                    ></textarea>
                </div>

                {/* Exibe mensagem de erro, se houver. */}
                {error && <p className="genre-edit-error">{error}</p>}

                <button
                    type="submit"
                    disabled={submitting}
                    className="form-submit-button"
                >
                    {submitting
                        ? "Salvando..."
                        : isEditing
                        ? "Atualizar Gênero"
                        : "Criar Gênero"}
                </button>

                {/* Botão para voltar à lista. */}
                <button
                    type="button"
                    onClick={() => navigate("/genres")}
                    className="form-back-button"
                    disabled={submitting}
                >
                    Voltar
                </button>
            </form>
        </div>
    );
};

// Validação das propriedades (não há props diretas, o ID é obtido via useParams).
GenresEdit.propTypes = {
    // Componente obtém o ID via useParams, não diretamente via props.
};

export default GenresEdit;
