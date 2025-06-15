import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function BookList() {
    const [livros, setLivros] = useState([]);

    useEffect(() => {
        api.get("/books")
            .then((response) => {
                console.log("Dados recebidos:", response.data);
                setLivros(response.data.data); // <- acesso correto
            })
            .catch((error) => {
                console.error("Erro ao buscar livros:", error);
                setLivros([]);
            });
    }, []);

    return (
        <div>
            <h2>Lista de Livros</h2>
            {Array.isArray(livros) && livros.length > 0 ? (
                <ul>
                    {livros.map((livro) => (
                        <li key={livro.id}>
                            {livro.titulo} — {livro.autor}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Nenhum livro encontrado.</p>
            )}
        </div>
    );
}
