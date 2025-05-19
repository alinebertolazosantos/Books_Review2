// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BooksPage from "./pages/BooksPage";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/books" element={<BooksPage />} />
                {/* Outras rotas futuras */}
            </Routes>
        </Router>
    );
};

export default App;
