// frontend/src/pages/GenresPage.jsx

import GenresList from "../components/Genres/GenresList"; // Importa o componente de listagem de Gêneros
import "./GenresPage.css"; // Importa o CSS para esta página (se houver estilos específicos da página)

const GenresPage = () => {
    return (
        <div className="genres-page-container">
            <h2 className="genres-page-title">Gerenciamento de Gêneros</h2>
            {/* O componente GenresList é renderizado dentro desta página */}
            <GenresList />
        </div>
    );
};

export default GenresPage;
