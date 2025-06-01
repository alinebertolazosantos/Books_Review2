// frontend/src/pages/PublishersPage.jsx

import PublisherList from "../components/Publishers/PublisherList"; // Importa o componente de listagem de Editoras
import "./PublishersPage.css"; // Importa o CSS para esta página (se houver estilos específicos da página)

const PublishersPage = () => {
    return (
        <div className="publishers-page-container">
            <h2 className="publishers-page-title">Gerenciamento de Editoras</h2>
            {/* O componente PublisherList é renderizado dentro desta página */}
            <PublisherList />
        </div>
    );
};

export default PublishersPage;
