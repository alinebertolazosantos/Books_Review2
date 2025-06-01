// frontend/src/pages/UserPage.jsx

import React from "react";
import UserList from "../components/Users/UserList"; // Importa o componente de listagem de Usuários
import "./UserPage.css"; // Importa o CSS para esta página (se houver estilos específicos da página)

const UserPage = () => {
    return (
        <div className="user-page-container">
            <h2 className="user-page-title">Gerenciamento de Usuários</h2>
            {/* O componente UserList é renderizado dentro desta página */}
            <UserList />
        </div>
    );
};

export default UserPage;
