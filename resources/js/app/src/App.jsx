import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import BookList from "./pages/BookList";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/livros" element={<BookList />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
