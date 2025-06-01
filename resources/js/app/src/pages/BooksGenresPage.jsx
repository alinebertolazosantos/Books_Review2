// frontend/src/pages/BooksGenresPage.jsx

import React from "react";
import BooksGenresList from "../components/BookGenres/BooksGenresList";
import "./BooksGenresPage.css"; // Importe o CSS se você criar um específico para a página

const BooksGenresPage = () => {
    return (
        <div className="books-genres-page-container">
            <h2 className="books-genres-page-title">
                Gerenciar Gêneros de Livros
            </h2>
            <BooksGenresList />
        </div>
    );
};

export default BooksGenresPage;
    