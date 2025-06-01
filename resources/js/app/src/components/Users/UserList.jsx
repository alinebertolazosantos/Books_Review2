// frontend/src/components/Users/UserList.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Para navegar para detalhes/edição/criação
import UserDestroy from "./UserDestroy"; // Importa o componente para exclusão de usuário
import "./UserList.css"; // Importa o CSS específico para esta lista

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // URL base da API Laravel.
    const API_BASE_URL = "http://localhost:8000/api";

    useEffect(() => {
        // Busca os usuários ao montar o componente.
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            // Requisição GET para listar todos os usuários.
            const response = await axios.get(`${API_BASE_URL}/users`);
            setUsers(response.data);
        } catch (err) {
            console.error(
                "Erro ao buscar usuários:",
                err.response?.data || err.message
            );
            setError("Erro ao carregar usuários. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const handleUserRemoved = (removedUserId) => {
        // Filtra o usuário removido da lista para atualizar a UI.
        setUsers((prevUsers) =>
            prevUsers.filter((user) => user.id !== removedUserId)
        );
    };

    // Exibe estado de carregamento.
    if (loading) {
        return <div className="user-list-loading">Carregando usuários...</div>;
    }

    // Exibe mensagem de erro.
    if (error) {
        return <div className="user-list-error">{error}</div>;
    }

    return (
        <div className="user-list-container">
            <h1 className="user-list-title">Meus Usuários</h1>

            {/* Link para a página de criação de um novo usuário. */}
            <Link to="/users/create" className="user-list-add-button">
                Adicionar Novo Usuário
            </Link>

            {users.length === 0 ? (
                <p className="user-list-no-data">
                    Nenhum usuário encontrado. Que tal adicionar um?
                </p>
            ) : (
                <ul className="user-list">
                    {users.map((user) => (
                        <li key={user.id} className="user-list-item">
                            <div className="user-item-info">
                                <span className="user-item-name">
                                    {user.name}
                                </span>
                                <span className="user-item-email">
                                    {user.email}
                                </span>
                            </div>
                            <div className="user-list-actions">
                                {/* Link para os detalhes do usuário. */}
                                <Link
                                    to={`/users/${user.id}`}
                                    className="user-list-button details"
                                >
                                    Detalhes
                                </Link>
                                {/* Link para a edição do usuário. */}
                                <Link
                                    to={`/users/${user.id}/edit`}
                                    className="user-list-button edit"
                                >
                                    Editar
                                </Link>
                                {/* Componente de exclusão do usuário. */}
                                <UserDestroy
                                    userId={user.id}
                                    userName={user.name}
                                    onUserRemoved={handleUserRemoved}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UserList;
