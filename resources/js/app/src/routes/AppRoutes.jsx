import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import BookList from "./pages/BookList";
import BooksGenresPage from "./pages/BooksGenresPage";
import BooksPage from "./pages/booksPage";
import GenresPage from "./pages/GenresPage";
import PublishersPage from "./pages/PublishersPage";
import ReadingStatusesPage from "./pages/ReadingStatusesPage";
import ReviewsPage from "./pages/ReviewsPage";
import UserPage from "./pages/UserPage";
import BookDetailsPage from "./pages/BookDetailsPage";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/livros" element={<BookList />} />
                <Route path="/livros-generos" element={<BooksGenresPage />} />
                <Route path="/livros-todos" element={<BooksPage />} />
                <Route path="/generos" element={<GenresPage />} />
                <Route path="/editoras" element={<PublishersPage />} />
                <Route
                    path="/status-leitura"
                    element={<ReadingStatusesPage />}
                />
                <Route path="/reviews" element={<ReviewsPage />} />
                <Route path="/usuario" element={<UserPage />} />
                <Route path="/livro/:id" element={<BookDetailsPage />} />
                <Route path="/register" element={<Signup />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
