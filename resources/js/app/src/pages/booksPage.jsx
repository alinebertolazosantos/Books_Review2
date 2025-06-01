import React, { useEffect, useState } from "react";
import api from "../services/api";

function BooksPage() {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        api.get("/books")
            .then((response) => {
                setBooks(response.data.data);
            })
            .catch((error) => {
                console.error("Erro ao carregar os livros:", error);
            });
    }, []);

    return (
        <div>
            <h1>Livros</h1>
            <ul>
                {books.map((book) => (
                    <li key={book.id}>
                        {book.title} - {book.author}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default BooksPage;
