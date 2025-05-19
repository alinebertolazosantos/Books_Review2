const BookList = ({ books, onEdit, onDelete }) => (
    <table>
        <thead>
            <tr>
                <th>Título</th>
                <th>Autor</th>
                <th>Ações</th>
            </tr>
        </thead>
        <tbody>
            {books.map((book) => (
                <tr key={book.id}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>
                        <button onClick={() => onEdit(book)}>✏️</button>
                        <button onClick={() => onDelete(book.id)}>🗑️</button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
);
