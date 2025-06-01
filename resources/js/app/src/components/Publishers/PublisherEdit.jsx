// frontend/src/components/Publishers/PublisherEdit.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // Para pegar o ID da URL e navegar
import PropTypes from "prop-types"; // Para validação de props
import "./PublisherEdit.css"; // Importa o CSS específico para este componente

const PublisherEdit = () => {
    // Pega o 'id' (publisherId) da URL, se existir.
    const { id: publisherId } = useParams();
    const navigate = useNavigate(); // Para navegar após a operação.

    // Estados para os campos do formulário da editora.
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(true); // Controla o carregamento inicial (para edição)
    const [submitting, setSubmitting] = useState(false); // Controla o estado de envio do formulário
    const [error, setError] = useState(null); // Para mensagens de erro

    // Determina se estamos editando ou criando.
    const isEditing = Boolean(publisherId);

    // URL base da API Laravel.
    const API_BASE_URL = "http://localhost:8000/api";

    useEffect(() => {
        // Se estiver editando, busca os detalhes da editora existente.
        const fetchPublisher = async () => {
            if (!isEditing) {
                setLoading(false); // Se não estiver editando, não precisa carregar dados existentes.
                return;
            }

            setLoading(true);
            setError(null);
            try {
                // Requisição GET para buscar os detalhes da editora a ser editada.
                const response = await axios.get(
                    `${API_BASE_URL}/publishers/${publisherId}`
                );
                const publisherData = response.data;
                setName(publisherData.name || "");
                setAddress(publisherData.address || "");
                setPhone(publisherData.phone || "");
                setEmail(publisherData.email || "");
            } catch (err) {
                console.error(
                    "Erro ao buscar editora para edição:",
                    err.response?.data || err.message
                );
                setError("Erro ao carregar dados da editora. Tente novamente.");
            } finally {
                setLoading(false);
            }
        };

        fetchPublisher(); // Busca os dados da editora apenas se estiver editando.
    }, [publisherId, isEditing]); // Re-executa se o ID ou o modo de edição mudar.

    const handleSubmit = async (e) => {
        e.preventDefault(); // Previne o comportamento padrão de recarregar a página.

        setSubmitting(true);
        setError(null); // Limpa erros anteriores.

        try {
            const publisherData = {
                name,
                address,
                phone,
                email,
                // Adicione outros campos da editora aqui, se houver.
            };

            if (isEditing) {
                // Requisição PUT/PATCH para atualizar uma editora existente.
                await axios.put(
                    `${API_BASE_URL}/publishers/${publisherId}`,
                    publisherData
                );
                alert("Editora atualizada com sucesso!");
            } else {
                // Requisição POST para criar uma nova editora.
                await axios.post(`${API_BASE_URL}/publishers`, publisherData);
                alert("Editora criada com sucesso!");
            }
            navigate("/publishers"); // Navega de volta para a lista de editoras após sucesso.
        } catch (err) {
            console.error(
                "Erro ao salvar editora:",
                err.response?.data || err.message
            );
            setError(
                err.response?.data?.message ||
                    "Erro ao salvar editora. Verifique os dados."
            );
        } finally {
            setSubmitting(false);
        }
    };

    // Exibe estado de carregamento.
    if (loading) {
        return (
            <div className="publisher-edit-loading">
                Carregando formulário...
            </div>
        );
    }

    return (
        <div className="publisher-edit-container">
            <h1 className="publisher-edit-title">
                {isEditing ? "Editar Editora" : "Criar Nova Editora"}
            </h1>

            <form onSubmit={handleSubmit} className="publisher-edit-form">
                <div className="form-group">
                    <label htmlFor="name">Nome da Editora:</label>
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
                    <label htmlFor="address">Endereço:</label>
                    <input
                        type="text"
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="phone">Telefone:</label>
                    <input
                        type="tel" // Tipo 'tel' para telefone
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email" // Tipo 'email' para email
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-input"
                    />
                </div>

                {/* Exibe mensagem de erro, se houver. */}
                {error && <p className="publisher-edit-error">{error}</p>}

                <button
                    type="submit"
                    disabled={submitting}
                    className="form-submit-button"
                >
                    {submitting
                        ? "Salvando..."
                        : isEditing
                        ? "Atualizar Editora"
                        : "Criar Editora"}
                </button>

                {/* Botão para voltar à lista. */}
                <button
                    type="button"
                    onClick={() => navigate("/publishers")}
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
PublisherEdit.propTypes = {
    // Componente obtém o ID via useParams, não diretamente via props.
};

export default PublisherEdit;
