// frontend/src/pages/ReviewsPage.jsx

import React from "react";
import ReviewsList from "../components/Reviews/ReviewsList"; // Importa o componente de listagem de Avaliações
import "./ReviewsPage.css"; // Importa o CSS para esta página (se houver estilos específicos da página)

const ReviewsPage = () => {
    return (
        <div className="reviews-page-container">
            <h2 className="reviews-page-title">Gerenciamento de Avaliações</h2>
            {/* O componente ReviewsList é renderizado dentro desta página */}
            <ReviewsList />
        </div>
    );
};

export default ReviewsPage;
