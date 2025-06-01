// frontend/src/App.js

import React from "react";
import {
    BrowserRouter as Router,
    Route,
    Routes,
    NavLink,
} from "react-router-dom";

// Importa os componentes de cada recurso.

// Componentes de Gêneros
import GenresList from "./components/Genres/GenresList";
import GenresDetails from "./components/Genres/GenresDetails";
import GenresEdit from "./components/Genres/GenresEdit";

// Componentes de Livros
import BookList from "./components/Books/BookList";
import BookDetails from "./components/Books/BookDetails";
import BookEdit from "./components/Books/BookEdit";

// Componentes de Editoras
import PublishersList from "./components/Publishers/PublishersList";
import PublishersDetails from "./components/Publishers/PublishersDetails";
import PublishersEdit from "./components/Publishers/PublishersEdit";

// Componentes de Status de Leitura
import ReadingStatusesList from "./components/ReadingStatuses/ReadingStatusesList";
import ReadingStatusesDetails from "./components/ReadingStatuses/ReadingStatusesDetails";
import ReadingStatusesEdit from "./components/ReadingStatuses/ReadingStatusesEdit";

// Componentes de Avaliações
import ReviewsList from "./components/Reviews/ReviewsList";
import ReviewsDetails from "./components/Reviews/ReviewsDetails";
import ReviewsEdit from "./components/Reviews/ReviewsEdit";

// Componentes de Usuários
import UsersList from "./components/Users/UsersList";
import UsersDetails from "./components/Users/UsersDetails";
import UsersEdit from "./components/Users/UsersEdit";

// Componente da Página Inicial
import HomePage from "./pages/HomePage";

function App() {
    return (
        <Router>
            {/* Barra de navegação principal. */}
            <nav className="main-nav">
                <NavLink
                    to="/"
                    end
                    className={({ isActive }) =>
                        isActive ? "active-link" : ""
                    }
                >
                    Home
                </NavLink>
                <NavLink
                    to="/books"
                    className={({ isActive }) =>
                        isActive ? "active-link" : ""
                    }
                >
                    Livros
                </NavLink>
                <NavLink
                    to="/genres"
                    className={({ isActive }) =>
                        isActive ? "active-link" : ""
                    }
                >
                    Gêneros
                </NavLink>
                <NavLink
                    to="/publishers"
                    className={({ isActive }) =>
                        isActive ? "active-link" : ""
                    }
                >
                    Editoras
                </NavLink>
                <NavLink
                    to="/reading-statuses"
                    className={({ isActive }) =>
                        isActive ? "active-link" : ""
                    }
                >
                    Status de Leitura
                </NavLink>
                <NavLink
                    to="/reviews"
                    className={({ isActive }) =>
                        isActive ? "active-link" : ""
                    }
                >
                    Avaliações
                </NavLink>
                <NavLink
                    to="/users"
                    className={({ isActive }) =>
                        isActive ? "active-link" : ""
                    }
                >
                    Usuários
                </NavLink>
            </nav>

            <div className="main-content">
                {/* Definição das rotas da aplicação. */}
                <Routes>
                    <Route path="/" element={<HomePage />} />

                    {/* Rotas para Livros */}
                    <Route path="/books" element={<BookList />} />
                    <Route path="/books/create" element={<BookEdit />} />
                    <Route path="/books/:id" element={<BookDetails />} />
                    <Route path="/books/:id/edit" element={<BookEdit />} />

                    {/* Rotas para Gêneros */}
                    <Route path="/genres" element={<GenresList />} />
                    <Route path="/genres/create" element={<GenresEdit />} />
                    <Route path="/genres/:id" element={<GenresDetails />} />
                    <Route path="/genres/:id/edit" element={<GenresEdit />} />

                    {/* Rotas para Editoras */}
                    <Route path="/publishers" element={<PublishersList />} />
                    <Route
                        path="/publishers/create"
                        element={<PublishersEdit />}
                    />
                    <Route
                        path="/publishers/:id"
                        element={<PublishersDetails />}
                    />
                    <Route
                        path="/publishers/:id/edit"
                        element={<PublishersEdit />}
                    />

                    {/* Rotas para Status de Leitura */}
                    <Route
                        path="/reading-statuses"
                        element={<ReadingStatusesList />}
                    />
                    <Route
                        path="/reading-statuses/create"
                        element={<ReadingStatusesEdit />}
                    />
                    <Route
                        path="/reading-statuses/:id"
                        element={<ReadingStatusesDetails />}
                    />
                    <Route
                        path="/reading-statuses/:id/edit"
                        element={<ReadingStatusesEdit />}
                    />

                    {/* Rotas para Avaliações */}
                    <Route path="/reviews" element={<ReviewsList />} />
                    <Route path="/reviews/create" element={<ReviewsEdit />} />
                    <Route path="/reviews/:id" element={<ReviewsDetails />} />
                    <Route path="/reviews/:id/edit" element={<ReviewsEdit />} />

                    {/* Rotas para Usuários */}
                    <Route path="/users" element={<UsersList />} />
                    <Route path="/users/create" element={<UsersEdit />} />
                    <Route path="/users/:id" element={<UsersDetails />} />
                    <Route path="/users/:id/edit" element={<UsersEdit />} />

                    {/* Rota para página não encontrada (404). */}
                    <Route
                        path="*"
                        element={<div>Página Não Encontrada (404)</div>}
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
