// src/pages/BooksPage.jsx
import React, { useEffect, useState } from "react";
import { getBooks, deleteBook } from "../services/bookService";
import BookForm from "../components/Books/BookForm";
import BookList from "../components/Books/BookList";

const BooksPage = () => {
    const [books, setBooks] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingBook, setEditingBook] = useState(null);

    // Carrega os livros
    const fetchBooks = async () => {
        try {
            const res = await getBooks();
            setBooks(res.data.data); // depende do seu retorno do Laravel
        } catch (error) {
            console.error("Erro ao buscar livros", error);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    // Apagar livro
    const handleDelete = async (id) => {
        await deleteBook(id);
        fetchBooks();
    };

    // Editar livro
    const handleEdit = (book) => {
        setEditingBook(book);
        setShowForm(true);
    };

    return (
        <div>
            <h1>📚 Lista de Livros</h1>

            {showForm ? (
                <BookForm
                    book={editingBook}
                    onSuccess={() => {
                        setShowForm(false);
                        fetchBooks();
                        setEditingBook(null);
                    }}
                    onCancel={() => {
                        setShowForm(false);
                        setEditingBook(null);
                    }}
                />
            ) : (
                <button onClick={() => setShowForm(true)}>➕ Novo Livro</button>
            )}

            <BookList
                books={books}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
};

export default BooksPage;
