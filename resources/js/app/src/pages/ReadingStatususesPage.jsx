// frontend/src/pages/ReadingStatusesPage.jsx

import React from "react";
import ReadingStatusesList from "../components/ReadingStatuses/ReadingStatusesList"; // Importa o componente de listagem de Status de Leitura
import "./ReadingStatusesPage.css"; // Importa o CSS para esta página (se houver estilos específicos da página)

const ReadingStatusesPage = () => {
    return (
        <div className="reading-statuses-page-container">
            <h2 className="reading-statuses-page-title">
                Gerenciamento de Status de Leitura
            </h2>
            {/* O componente ReadingStatusesList é renderizado dentro desta página */}
            <ReadingStatusesList />
        </div>
    );
};

export default ReadingStatusesPage;
