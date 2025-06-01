// frontend/src/components/Users/UserEdit.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // Para pegar o ID da URL e navegar
import PropTypes from "prop-types"; // Para validação de props
import "./UserEdit.css"; // Importa o CSS específico para este componente

const UserEdit = () => {
    // Pega o 'id' (userId) da URL, se existir.
    const { id: userId } = useParams();
    const navigate = useNavigate(); // Para navegar após a operação.

    // Estados para os campos do formulário do usuário.
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(""); // Apenas para criação ou alteração de senha
    const [passwordConfirmation, setPasswordConfirmation] = useState(""); // Confirmação de senha

    const [loading, setLoading] = useState(true); // Controla o carregamento inicial (para edição)
    const [submitting, setSubmitting] = useState(false); // Controla o estado de envio do formulário
    const [error, setError] = useState(null); // Para mensagens de erro

    // Determina se estamos editando ou criando.
    const isEditing = Boolean(userId);

    // URL base da API Laravel.
    const API_BASE_URL = "http://localhost:8000/api";

    useEffect(() => {
        // Se estiver editando, busca os detalhes do usuário existente.
        const fetchUser = async () => {
            if (!isEditing) {
                setLoading(false); // Se não estiver editando, não precisa carregar dados existentes.
                return;
            }

            setLoading(true);
            setError(null);
            try {
                // Requisição GET para buscar os detalhes do usuário a ser editado.
                const response = await axios.get(
                    `${API_BASE_URL}/users/${userId}`
                );
                const userData = response.data;
                setName(userData.name || "");
                setEmail(userData.email || "");
                // Senha e confirmação de senha não são preenchidas para edição por segurança.
            } catch (err) {
                console.error(
                    "Erro ao buscar usuário para edição:",
                    err.response?.data || err.message
                );
                setError("Erro ao carregar dados do usuário. Tente novamente.");
            } finally {
                setLoading(false);
            }
        };

        fetchUser(); // Busca os dados do usuário apenas se estiver editando.
    }, [userId, isEditing]); // Re-executa se o ID ou o modo de edição mudar.

    const handleSubmit = async (e) => {
        e.preventDefault(); // Previne o comportamento padrão de recarregar a página.

        setSubmitting(true);
        setError(null); // Limpa erros anteriores.

        // Validação básica de senhas para criação/alteração.
        if (!isEditing && password !== passwordConfirmation) {
            setError("A senha e a confirmação de senha não conferem.");
            setSubmitting(false);
            return;
        }
        if (password && password !== passwordConfirmation) {
            // Para edição, se a senha for preenchida
            setError("A senha e a confirmação de senha não conferem.");
            setSubmitting(false);
            return;
        }

        try {
            const userData = {
                name,
                email,
            };

            // Adiciona a senha apenas se estiver criando ou se a senha for preenchida na edição.
            if (!isEditing || password) {
                userData.password = password;
                userData.password_confirmation = passwordConfirmation;
            }

            if (isEditing) {
                // Requisição PUT/PATCH para atualizar um usuário existente.
                await axios.put(`${API_BASE_URL}/users/${userId}`, userData);
                alert("Usuário atualizado com sucesso!");
            } else {
                // Requisição POST para criar um novo usuário.
                await axios.post(`${API_BASE_URL}/users`, userData);
                alert("Usuário criado com sucesso!");
            }
            navigate("/users"); // Navega de volta para a lista de usuários após sucesso.
        } catch (err) {
            console.error(
                "Erro ao salvar usuário:",
                err.response?.data || err.message
            );
            // Tenta pegar mensagens de erro mais específicas da resposta da API.
            const apiErrorMessage =
                err.response?.data?.message || err.response?.data?.error || "";
            const validationErrors = err.response?.data?.errors; // Erros de validação do Laravel

            let displayError = apiErrorMessage;
            if (validationErrors) {
                displayError = Object.values(validationErrors)
                    .flat()
                    .join("; ");
            }
            setError(
                displayError || "Erro ao salvar usuário. Verifique os dados."
            );
        } finally {
            setSubmitting(false);
        }
    };

    // Exibe estado de carregamento.
    if (loading) {
        return (
            <div className="user-edit-loading">Carregando formulário...</div>
        );
    }

    return (
        <div className="user-edit-container">
            <h1 className="user-edit-title">
                {isEditing ? "Editar Usuário" : "Criar Novo Usuário"}
            </h1>

            <form onSubmit={handleSubmit} className="user-edit-form">
                <div className="form-group">
                    <label htmlFor="name">Nome:</label>
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
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">
                        {isEditing ? "Nova Senha (opcional):" : "Senha:"}
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        // Senha é obrigatória apenas na criação
                        required={!isEditing}
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="passwordConfirmation">
                        {isEditing
                            ? "Confirmar Nova Senha:"
                            : "Confirmar Senha:"}
                    </label>
                    <input
                        type="password"
                        id="passwordConfirmation"
                        value={passwordConfirmation}
                        onChange={(e) =>
                            setPasswordConfirmation(e.target.value)
                        }
                        // Confirmação é obrigatória se a senha for preenchida
                        required={!isEditing || Boolean(password)}
                        className="form-input"
                    />
                </div>

                {/* Exibe mensagem de erro, se houver. */}
                {error && <p className="user-edit-error">{error}</p>}

                <button
                    type="submit"
                    disabled={submitting}
                    className="form-submit-button"
                >
                    {submitting
                        ? "Salvando..."
                        : isEditing
                        ? "Atualizar Usuário"
                        : "Criar Usuário"}
                </button>

                {/* Botão para voltar à lista. */}
                <button
                    type="button"
                    onClick={() => navigate("/users")}
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
UserEdit.propTypes = {
    // Componente obtém o ID via useParams, não diretamente via props.
};

export default UserEdit;
